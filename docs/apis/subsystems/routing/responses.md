---
title: Responses
tags:
 - PSR-7
 - ResponseInterface
 - payload
---

When creating a Route you will need to return some data. This can be achieved in a number of ways, depending on the purpose of the route and data type.

Routes must return one of the following types:

- A PSR `ResponseInterface` - `\Psr\Http\Message\ResponseInterface`
- A Data Object represented by a `payload_response` - `\core\router\schema\response\payload_response`

Other types may be added in the future, for example to support rendering a template.

:::danger Web Service Response types

Web Service responses will almost always return a `payload_reponse` to allow validation of their data.

:::

## Data as a Payload Response

The Moodle `\core\router\schema\response\payload_response` class represents a set of data for return to the user. By default it is serialized into JSON as part of the Response handling and is automatically checked against the schema for valid response types.

You can create a payload response with:

```php
return new payload_response(
    payload: $result,
    request: $request,
    response: $response,
);
```

The request should be the `ServerRequestInterface` that was passed into the route method, and the payload can be an Array containing any JSON-encodable data.

Where possible the `ResponseInterface` instance passed into the route method should be provided.

In the following example a JSON structure containing three users will be created.

```php title="Returning data with a payload response"
// mod/example/classes/route/api/example.php
namespace mod_example\route\api;

use core\router\schema\response\payload_response;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class example {
    #[\core\router\route(
        // Resolves to https://example.com/moodle/api/rest/v2/mod_example/example
        path: '/example',
    )]
    public function example_route(
        ServerRequestInterface $request,
        ResponseInterface $response,
    ): ResponseInterface {
        return new payload_respoinse(
            request: $request,
            response $response,
            payload: [
                'users' => [
                    'charlie',
                    'john',
                    'david',
                ],
            ],
        );
    }
}
```

:::tip Why a `payload_response` object is used instead of raw JSON

Whilst you are _able_ to return JSON directly this is strongly discouraged because:

- additional processing would be required to JSON-decode the data in order to validate the response; and
- by using a generic payload response it is theoretically possible to return data in other formats such as XML and YAML.

:::

### Adding Headers to the payload

In some cases you may wish to provide additional data using the HTTP Response Header. This can be achieved by modifying the Response object before passing it into the `payload_response`, for example:

```php title="Adding the X-Example header to the payload header"
$response = $response->withHeader(
    'X-Example',
    'This header is added to the Response',
);

return new payload_response(
    payload: [
        'some' => [
            'data' => [
                'children' => $children,
            ],
        ],
    ],
    request: $request,
    response: $response,
);
```

:::tip

Other modifications to the Response are also possible, but the Response Body will always be replaced with the payload data.

:::
