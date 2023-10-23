---
title: Advanced grading API
tags:
  - Plugins
  - Grading
  - Activity grading
documentationDraft: true
---

Advanced grading was introduced in Moodle 2.2 for grading of assignments. It is intended to be used for grading of other types of activities in the later versions.

## Glossary

In advanced grading we operate with three main entities:

- a grading area;
- a grading form definition; and
- a grading form instance.

### Grading area

The grading area is basically the area that can be graded, for example, a submission in an assignment module. Each grading area may have several grading definitions but only one for each grading method. In an assignment's edit form (or its Advanced grading page) the teacher may set one of the advanced grading methods as current. The class called **`grading_manager`** is responsible for grading method operations in the specified area.

### Grading form definition

Grading form definitions are the set of rules defining how the grading is performed. For example, in rubrics this is the set of criteria and levels and their display options. The basic information about definition is stored in the DB table grading_definitions. A separate entry is created for each grading area (that is for each module). Users with permission `moodle/grade:managegradingforms` are able to edit the definitions and mark them as "Ready".

### Grading form instance

A grading form instance is created for each evaluation of a submission, using advanced grading. One instance (usually the latest) has the status INSTANCE_STATUS_ACTIVE. Sometimes it may be the case that a teacher wants to change the definition after some students have already been graded. In this case their instances change status to `INSTANCE_STATUS_NEEDUPDATE`. The grade pushed to the gradebook remains unchanged but students will not see the grade in advanced grading format until teacher updates them. Plugins are also welcome to use these status levels.

## Functions

## Examples

### Using advanced grading in grade-able modules

The following example is drawn from **/mod/assignment/lib.php**.

1. In order for module to support advanced grading, its function **`[activityname]_supports(FEATURE_ADVANCED_GRADING)`** must return true.

    ```php title="mod/[activityname]/lib.php"
    function [activityname]_supports(string $feature): ?bool {
        switch ($feature) {
            // ...
            case FEATURE_ADVANCED_GRADING:
                return true;
            // ...
        }
    }
    ```

1. The module should define a function called **`[activityname]_grading_areas_list()`**.
1. There needs to be a check to see if there is an advanced grading method for this area and it is available. If it is, retrieve it and set the grade range used in this module.

    ```php
    if ($controller = get_grading_manager(...)->get_active_controller()) {
        $controller->set_grade_range(...);
        ...
    }
    ```

1. There are two ways to create an grading object instance. Choose one of the following.

    ```php
    $gradinginstance = $controller->get_current_instance(...);
    $gradinginstance = $controller->get_or_create_instance(...);
    ```

1. During population of the grading form, simple grading elements can now be substituted with advanced grading element.

    ```php
    $mform->addElement(
        'grading',
        'ELEMENTNAME',
        '...',
        ['gradinginstance' => $gradinginstance]
    );
    ```

1. On submission of a grading form, the advanced grading information shall be also submitted. The grade for the gradebook retrieved from plugin and saved to the gradebook.

    ```php
    $grade = $gradinginstance->submit_and_get_grade($data->ELEMENTNAME, ...)
    ```

1. When the grade is displayed to the student it is displayed using the grading objects renderer.

    ```php
    $output .= $controller->render_grade(...);
    ```

1. To show the grading method to students before they are actually graded:

    ```php
    $output .= $controller->render_preview($PAGE);
    ```
