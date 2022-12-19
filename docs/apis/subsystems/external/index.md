---
title: Web Services
tags:
  - external
  - core_external
  - API
---

### How it works

This example will give you an idea of how our web services infrastructure works.

1. The client sends a username and password to the web service login script.
1. The script returns a token for that user account.
1. The client calls a particular web service function on a protocol server including the token .
1. The protocol server uses the token to check that the user can call the function.
1. The protocol server calls the matching external function, located under the \component\external namespace (previously in a externallib.php file inside the relevant module).
1. The external function checks that the current user has_capability to do this operation.
1. The external function calls the matching Moodle core function (in lib.php usually).
1. The core function can return a result to the external function.
1. The external function will return a result to the protocol server.
1. The protocol server returns the result to the client.

## Developer documentation

The full API can be found on any Moodle sites under ** Administration block > Plugins > Web services > API Documentation**.

**Note:** Additional services are available for uploading and downloading files which are not in the API Documentation - they are accessed in a different way. See [Web services files handling](https://docs.moodle.org/dev/Web_services_files_handling)

- [How to contribute a web service function to core](https://docs.moodle.org/dev/How_to_contribute_a_web_service_function_to_core)
- [Adding a web service to your plugin](https://docs.moodle.org/dev/Adding_a_web_service_to_a_plugin)
- Code example: [Adding a web service, using APIs](https://gist.github.com/timhunt/51987ad386faca61fe013904c242e9b4) by (Tim Hunt)
- [Implement a web service client](https://docs.moodle.org/dev/Creating_a_web_service_client_)
- [Web services files handling](https://docs.moodle.org/dev/Web_services_files_handling)
- [Web service Listing & Roadmap](https://docs.moodle.org/dev/Web_services_Roadmap_)

## Specification and brainstorming

- [External services security](https://docs.moodle.org/dev/External_services_security_)
- [External services description](https://docs.moodle.org/dev/External_services_description_)

## See also

- [Web service API functions](https://docs.moodle.org/dev/Web_service_API_functions)
- [Web services FAQ](https://docs.moodle.org/en/Web_services_FAQ)
- [How to create and enable a web service](https://docs.moodle.org/en/How_to_create_and_enable_a_web_service)
- [How to enable the mobile web service](https://docs.moodle.org/en/Enable_mobile_web_services)
- [Web services user documentation](https://docs.moodle.org/en/Web_services)
- [Mastering Moodle Web Services development](http://www.slideshare.net/juanleyva/mastering-moodle-web-services-development) - Last session of the Hackfest in the MoodleMoot UK 2016
