---
title: AI Subsystem
tags:
    - AI
    - LLM
    - Provider
    - Placement
---

<Since version="4.5" issueNumber="MDL-80888" />

The AI Subsystem in Moodle LMS provides a consistent and user-friendly way for users to interact with AI
in Moodle's user interface, as they do their teaching and learning activities.
As well as providing a straightforward way to integrate with various AI providers on the backend.

## What is AI in this context?

When we talk about AI in the context of this subsystem, AI is: anything that's plugged in via a Provider
Plugin and provides one or more Actions.

Artificial Intelligence (AI), Machine Learning (ML), Large Language Models (LLMs), Generative AI, etc.
are all individual terms with discrete meanings. However, to keep things simple and in the context of
the subsystem everything is just called AI.

## Design Overview

The AI subsystem consists of the following (main) components:

- **Placements**
  - Are the UI components and associated workflows that allow users to interact with AI.
  - They implement one or more AI actions.
  - They provide a consistent experience for users regardless of which AI is providing the action
  - They are LMS plugins
- **Actions**
  - These are the "things" users can do with AI.
  - Examples of an action include: generating text, generating an image, providing a chat interface.
  - Actions don't have a UI, they are classes that provide a predictable interface.
- **Providers**
  - Providers are the interface between AI systems and the Moodle LMS.
  - They implement support for one or more actions.
  - Providers should not have an UI, apart from those required for settings,
  to configure and manage the provider. For example an Administration UI to allow setting of API
  keys; and/or to enable or disable the enabled actions.
  - The aim of Providers is to make it "easy" to integrate AI systems with LMS,
  without the need to implement a UI to use them.
  - They are LMS plugins
- **Subsystem Manager**
  - This is implemented at code level and is a core part of the subsystem design.
  - It is the "controller" that sits between Placements and Providers.
  - It allows Placements to pass user requests to Providers and handles all the calls to
  the providers including prioritisation and logging.
  - It allows Providers to respond to action requests.

### Placements

The aim of Placements is to provide a consistent UX and UI for users when they use AI backed functionality.

Placement plugins leverage the functionality of the other components of the AI subsystem.
This means plugin authors can focus on how users interact with the AI functionality, without needing to
implement the AI functionality itself.

Because Placements are LMS plugins in their own right and are not "other" types of LMS plugins,
it gives great flexibility in how AI functionality is presented to users.

See the [Placements](/apis/plugintypes/ai/placement.md) documentation for more information
on developing Placement plugins.

### Providers

Provider plugins are the interface between the LMS AI subsystem and external AI systems.
Their focus is on converting the data requested by an Action into the format needed by the
external AI services API, and then correctly providing the response back from the AI
in an Action Response object.

Because of this design the Providers that provide the AI Actions can be swapped out, mix and matched
or upgraded; both without the need to update the Placement code and without the need to change the
way users interact with the functionality.

See the [Providers](/apis/plugintypes/ai/provider.md) documentation for more information
on developing Provider plugins.

### Subsystem Manager

The Subsystem Manager is the "controller" that sits between Placements and Providers.

:::warning The Golden Rule:

Placements DO NOT know about Providers, and Providers DO NOT know about Placements.
Everything should go via the Manager.

:::

The manager class `\core_ai\manager()` is the "controller" for the subsystem.
In general it will be how most processes will interact with the AI subsystem.

The main method in the class is `process_action(base $action): responses\response_base`
this is the entry point for Action processing. Every Placement that wants to process an AI action
calls this method.
The manager will determine what Providers support this action and then hand off the action object to
a Provider. The Provider **MUST** return an action response object. This method will also store the
result of each action call.

The manager class also has various utility methods that can be accessed.
Such as getting the list of providers for specific actions, which is used to help render
administration settings.

### AI User Policy

Inline with Moodle's AI Principles and as guided by emerging legislation; users must accept an
AI policy before using AI in LMS. As the requirements are different to a site policy
(legislation, seems to indicate it acknowledgement of AI must be made at point of use),
separate policy functionality has been implemented for the subsystem.

All Placements must implement a check to see if a user has accepted the AI Policy.
Placements must also provide a way for users to accept the policy.
If a user has not previously accepted the AI Policy, the Placement must display the policy to the
user, and the user is not able to use the placement until they accept the policy.
Users only need to accept the policy once.

To assist Placements with policy display and acceptance the Manager provides the following functionality:

- The Manager makes the following methods available for Placements to call directly:
  - `\core_ai\manger::get_user_policy(int $userid): bool` -
  Given a user ID (record id in user table), returns true if the user has accepted the policy,
  false otherwise. It handles looking up the status and caching the response.
  - `\core_ai\manager::set_user_policy(int $userid, int $contextid): bool` -
  Given a user ID and a Context ID (of the context the policy was displayed in) set the policy
  acceptance.
- The manager class also makes available webservices to be used for policy setting and getting.
  This helps Placements set policy acceptance via ajax as part of a UI workflow:
  - `core_ai_get_policy_status` -
  Gets the policy status for a user. Calls: `core_ai\external\get_policy_status`
  - `core_ai_set_policy_status` -
  Sets the policy status for a user. Calls: `core_ai\external\set_policy_status`

### Actions

Actions provide a structured way to work with AI. Placements create an Action object when they want
to interact with AI and Providers, and it is an Action that Providers consume.

Actions are defined as classes in the `\core_ai\aiactions` namespace.
The naming convention for Action classes is `<verb>_<noun singular>`,
for example: `generate_image`, `translate_text`.

Each action **MUST** inherit from the `\core_ai\aiactions\base()` abstract class.
They must also implement two methods:

- `__construct(...args): void`
  - The constructor method is allowed to have a variable signature, so that each action can define its own
  configuration requirements.
  - The method **MUST** take a `contextid` as one of the variables.
  - An Action **MUST** be correctly instantiated before it can be used and passed onto the AI manager.
  For example the constructor method for the generate_image Action is:

```php
public function __construct(
    int $contextid,
    /** @var int The user id requesting the action. */
    protected int $userid,
    /** @var string The prompt text used to generate the image */
    protected string $prompttext,
    /** @var string The quality of the generated image */
    protected string $quality,
    /** @var string The aspect ratio of the generated image */
    protected string $aspectratio,
    /** @var int The number of images to generate */
    protected int $numimages,
    /** @var string The visual style of the generated image */
    protected string $style,
) {
    parent::__construct($contextid);
}
```

- `store(response_base $response): int`
  - This method is responsible for storing any action specific data related to the action in the
  LMS database.
  - Each Action must store its own data can that can be referenced later.
  - It takes a matching response class, that contains the result of the action call.
  - For example the store() call form the generate_image Action is:

```php
#[\Override]
public function store(response_base $response): int {
    global $DB;

    $responsearr = $response->get_response_data();

    $record = new \stdClass();
    $record->prompt = $this->prompttext;
    $record->numberimages = $this->numimages;
    $record->quality = $this->quality;
    $record->aspectratio = $this->aspectratio;
    $record->style = $this->style;
    $record->sourceurl = $responsearr['sourceurl']; // Can be null.
    $record->revisedprompt = $responsearr['revisedprompt']; // Can be null.

    return $DB->insert_record($this->get_tablename(), $record);
}
```

It is up to the action to define its own database schema and stored data, that is relevant to
what the action does. For example the database table definition for the generate_image Action is:

```xml
<TABLE NAME="ai_action_generate_image" COMMENT="stores specific data about generate image actions">
    <FIELDS>
        <FIELD NAME="id" TYPE="int" LENGTH="10" NOTNULL="true" SEQUENCE="true"/>
        <FIELD NAME="prompt" TYPE="text" NOTNULL="true" SEQUENCE="false" COMMENT="The text from the user that was used to generate the image"/>
        <FIELD NAME="numberimages" TYPE="int" LENGTH="10" NOTNULL="true" SEQUENCE="false" COMMENT="The number of images requested to be generated"/>
        <FIELD NAME="quality" TYPE="char" LENGTH="21" NOTNULL="true" SEQUENCE="false" COMMENT="The quality of the image, e.g. hd."/>
        <FIELD NAME="aspectratio" TYPE="char" LENGTH="20" NOTNULL="false" SEQUENCE="false" COMMENT="The aspect ratio of the generate image, e.g landscape"/>
        <FIELD NAME="style" TYPE="char" LENGTH="20" NOTNULL="false" SEQUENCE="false" COMMENT="The style of the image, e.g. vivid"/>
        <FIELD NAME="sourceurl" TYPE="text" NOTNULL="false" SEQUENCE="false" COMMENT="URL of the generated response."/>
        <FIELD NAME="revisedprompt" TYPE="text" NOTNULL="false" SEQUENCE="false" COMMENT="The actual prompt the AI used to generate the image"/>
    </FIELDS>
    <KEYS>
        <KEY NAME="primary" TYPE="primary" FIELDS="id"/>
    </KEYS>
</TABLE>
```

The naming convention for Action database tables is `ai_action_<action_name>`,
for example: `ai_action_generate_image`, `ai_action_translate_text`.

#### Responses

When a Provider processes an Action it **MUST** return a response object.
This allows Placements to receive an expected response for any Action call.
Each Action has a matching response class. The provider that processes the Action will instantiate
an instance of this response class and populate it with the data required for this type of response.

Each Action response MUST inherit from the `\core_ai\aiactions\responses\response_base` abstract
class. They must also implement two methods:

- `set_response(array $response): void`
  - Taking an array of response variables (which must be defined as class variables),
  it sets these against class variables so they can be retrieved by the Manager and calling Placement.
- `get_response(): array`
  - Returns the set response data.

For example the `set_response()` for the generate_image Action response is:

```php
    #[\Override]
    public function set_response_data(array $response): void {
        $this->draftfile = $response['draftfile'] ?? null;
        $this->revisedprompt = $response['revisedprompt'] ?? null;
        $this->sourceurl = $response['sourceurl'] ?? null;
    }
```

And the `get_response()` for the generate_image Action response is:

```php
    #[\Override]
    public function get_response_data(): array {
        return [
            'draftfile' => $this->draftfile,
            'revisedprompt' => $this->revisedprompt,
            'sourceurl' => $this->sourceurl,
        ];
    }
```

The naming convention for Action Response classes is `response_<action_name>`,
for example: `response_generate_image`, `response_translate_text`.
