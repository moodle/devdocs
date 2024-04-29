---
title: Self Enrolment
tags:
  - Moodle App
---

Using [CoreEnrolDelegate](../api-reference.md#coreenroldelegate-43) handlers you can support enrolment plugins in the app. In this example, we can see how to support a self enrol plugin. You'll need to register a handler in `db/mobile.php` and return the following JavaScript from the `method` implementation:

```js
const getEnrolmentInfo = (id) => {
    // Get enrolment info for the enrol instance.
    // Used internally, you can use any name, parameters and return data in here.
};

const selfEnrol = (method, info) => {
    // Self enrol the user in the course.
    // Used internally, you can use any name, parameters and return data in here.
};

var result = {
    getInfoIcons: (courseId) => {
        return this.CoreEnrolService.getSupportedCourseEnrolmentMethods(courseId, 'selftest').then(enrolments => {
            if (!enrolments.length) {
                return [];
            }

            // Since this code is for testing purposes just use the first one.
            return getEnrolmentInfo(enrolments[0].id).then(info => {
                if (!info.enrolpassword) {
                    return [{
                        label: 'plugin.enrol_selftest.pluginname',
                        icon: 'fas-right-to-bracket',
                    }];
                } else {
                    return [{
                        label: 'plugin.enrol_selftest.pluginname',
                        icon: 'fas-key',
                    }];
                }
            });
        });
    },
    enrol: (method) => {
        return getEnrolmentInfo(method.id).then(info => {
            return selfEnrol(method, info);
        });
    },
    invalidate: (method) => {
        // Invalidate WS data.
    },
};

result;
```

## Other examples

You can find more examples about this type of plugins in [MOBILE-4323](https://tracker.moodle.org/browse/MOBILE-4323).
