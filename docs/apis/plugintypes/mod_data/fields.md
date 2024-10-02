
---

```yaml
---
title: "Database Fields for Moodle 4.4.3"
last_updated: "2024-10-02"
tags: 
  - "mod_data"
  - "datafield"
  - "plugin"
  - "subplugin"
---
```

# **Database Fields for Moodle 4.4.3**

*This documentation is a work-in-progress. Feel free to contribute.*

The **Database activity** in Moodle allows users to create structured collections of data. It supports various predefined field types like **text**, **date**, and **URL**. Developers can extend Moodle by creating custom field types, which are beneficial for specialized uses like discipline-specific, institution-specific, or module-specific needs.

## **Custom Field Types Examples**

- **Discipline-specific field types**:  
  Example: *"Protein PDB code"* allows users to input a PDB code, displaying a 3D viewer of the protein structure or linking to molecular databases.

- **Institution-specific field types**:  
  Example: *"Library reference number"* allows users to input reference numbers that convert into direct links for local library services.

- **Module-specific field types**:  
  Example: *"Wiki page"* field provides a dropdown list of wiki pages, linking database entries to specific wiki content.

## **File Structure for Field Sub-Plugins**

Custom database field sub-plugins are located in `/mod/data/field`. Each plugin resides in a separate subdirectory and contains several required files.

## **Key Files for Field Plugins**

### **1. `field.class.php` (Required)**

Defines the field type and its behaviors within a class named `data_field_[pluginname]`. This class must extend the `data_field_base` base class.

### **Key Functions to Override:**

- `display_add_field($recordid = 0)`: Generates HTML for adding or editing a record.
- `display_browse_field($recordid, $template)`: Generates HTML for browsing records.
- `update_content($recordid, $value, $name = '')`: Saves user input data.
- `get_sort_sql($fieldname)`: Defines SQL for sorting records by the field.
- `get_content_value($value)`: Retrieves and transforms the data for display.

## **Class Locations and Autoloading**

Custom field definitions reside in `field.class.php`. **Moodle 4.4.3** does not autoload this file, so it is recommended to follow Moodle's [autoloading guidelines](https://moodledev.io/docs/guidelines/files/autoloading) to ensure future compatibility.

## **Field Configuration Form**

**File Path:** `/mod.html` (Required)

This file defines the form for adding or editing the field's configuration. Moodle’s **Form API** is used to create input elements. Here is an example:

```php
$mform->addElement('text', 'fieldname', get_string('fieldname', 'datafield_[pluginname]'), 'size="30"');
$mform->setType('fieldname', PARAM_TEXT);
$mform->addRule('fieldname', null, 'required', null, 'client');
```

**Note**: The form retains some legacy elements, so developers are encouraged to update it to follow Moodle's [Form API guidelines](https://moodledev.io/docs/apis/core/dml/moodleform).

## **Security Best Practices**

When creating custom fields, ensure inputs are properly validated and sanitized. Use Moodle's security functions, such as `required_param()` and `optional_param()`, to prevent SQL injection and XSS attacks.

Example:

```php
$input = required_param('input', PARAM_ALPHANUM);
```

## **Testing and Compatibility**

Custom field plugins should be tested for compatibility across Moodle 4.4.3’s supported environments, including:

- **PHP 8.1**
- **MariaDB 10.6.7**
- **MySQL 8.0**
- **PostgreSQL 13**
- **MSSQL 2017**
- **Oracle 19c**

Use Moodle’s [unit testing framework](https://moodledev.io/docs/apis/core/testing/phpunit) for automated testing to ensure functionality across different environments.

## **Form API Enhancements in Moodle 4.4.3**

Moodle 4.4.3 introduces improvements to the **Form API** for better accessibility and user experience. Ensure that custom field forms are:

- Mobile-responsive
- Accessible
- Optimized for modern browsers

Follow Moodle's accessibility guidelines to make sure your forms work well for all users.

## **Version Control and Deployment**

To ensure smooth development and deployment of custom field types:

- Use Moodle’s **Git version control** system.
- Maintain proper versioning for compatibility with Moodle's plugin directory and version upgrades.

Developers should submit and maintain their plugins in the [Moodle Plugin Directory](https://moodle.org/plugins).

---

## **Key Considerations for Moodle 4.4.3:**

- Use **updated coding standards** to align with Moodle's guidelines for PHP 8.1.
- Implement **security features** to avoid vulnerabilities.
- Ensure **compatibility** across Moodle's supported environments.
- Follow **best practices** for form creation and plugin configuration management.

By following these guidelines, developers can ensure their custom field types are secure, modern, and compatible with future Moodle releases.

---

**Last Updated**: 2 October 2024

---
