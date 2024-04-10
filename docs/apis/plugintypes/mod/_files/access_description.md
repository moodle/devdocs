<!-- markdownlint-disable first-line-heading -->
For activities the following capabilities are _required_:

- `mod/[modname]:addinstance`: Controls whether a user may create a new instance of the activity
- `mod/[modname]:view`: Controls whether a user may view an instance of the activity

The example below shows the recommended configuration for the `addinstance` and `view` capabilities.

This configuration will allow:

- editing teachers and managers to create new instances, but not non-editing teachers.
- all roles to view the activity.

:::important

Granting the view capability to archetypes like `guest` does not allow any user to view all activities. Users are still subject to standard access controls like course enrolment.

:::

For further information on what each attribute in that capabilities array means visit [NEWMODULE Adding capabilities](https://docs.moodle.org/dev/NEWMODULE_Adding_capabilities).
