

## **Database Fields for Moodle 4.4.3**

*This documentation is a work-in-progress. Feel free to contribute.*

The **Database activity** in Moodle allows users to create structured collections of data, including support for predefined field types such as **text**, **date**, and **URL**. Developers can create custom field types for more specialized uses, ensuring flexibility and adaptability across different institutions or academic needs.

### **Custom Field Types Examples**
- **Discipline-specific field types**:  
  Example: *“Protein PDB code”* allows users to input a PDB code, which displays a 3D viewer of the protein structure or links to molecular databases.
  
- **Institution-specific field types**:  
  Example: *“Library reference number”* enables users to input reference numbers that can convert into direct links for local library services.
  
- **Module-specific field types**:  
  Example: *“Wiki page”* field provides a dropdown list of wiki pages, allowing users to link database entries to specific wiki content.

---

### **File Structure for Field Sub-Plugins**

Custom database field sub-plugins are located in `/mod/data/field`. Each plugin is in a separate subdirectory with several required files, as well as any additional files developers might use.

---

### **Key Files for Field Plugins**

#### **1. `field.class.php` (Required)**
Defines the field type, behaviors, and properties in a class named `data_field_[pluginname]`. This class must extend the `data_field_base` base class.

#### **Key Functions to Override:**
- `display_add_field($recordid = 0)`: Generates HTML for adding or editing a record.
- `display_browse_field($recordid, $template)`: Generates HTML for browsing records.
- `update_content($recordid, $value, $name = '')`: Saves data entered by the user.
- `get_sort_sql($fieldname)`: Defines SQL for sorting the field.
- `get_content_value($value)`: Retrieves the content that users will see, potentially transforming data before display.

---

### **Class Locations and Autoloading**

Custom field definitions reside in `field.class.php`, and **Moodle 4.4.3** still does not autoload this file. It is recommended to follow Moodle’s [autoloading guidelines](https://moodledev.io/docs/guidelines/files/autoloading) to future-proof your code and maintain compatibility with upcoming releases.

---

### **Field Configuration Form**

#### **File Path:** `/mod.html` (Required)

This file defines the form for adding or editing the field configuration. It uses Moodle's **Form API** to create input elements.

```php
$mform->addElement('text', 'fieldname', get_string('fieldname', 'datafield_[pluginname]'), 'size="30"');
$mform->setType('fieldname', PARAM_TEXT);
$mform->addRule('fieldname', null, 'required', null, 'client');
```

**Note**: The form creation process for fields retains legacy elements and does not follow modern best practices. Developers are encouraged to update these forms and follow Moodle’s [Form API guidelines](https://moodledev.io/docs/apis/core/dml/moodleform).

---

### **Security Best Practices**

Moodle 4.4.3 enforces updated security protocols. When creating custom fields, ensure that inputs are properly validated and sanitized. Use Moodle's security functions like `required_param()` and `optional_param()` to prevent attacks such as SQL injection and cross-site scripting (XSS).

Example:

```php
$input = required_param('input', PARAM_ALPHANUM);  // Only accepts alphanumeric characters
```

---

### **Testing and Compatibility**

Custom field plugins must be tested for compatibility across Moodle 4.4.3 supported environments:
- **PHP 8.1**
- **MariaDB 10.6.7**
- **MySQL 8.0**
- **PostgreSQL 13**
- **MSSQL 2017**
- **Oracle 19c**

Developers should use Moodle’s [unit testing framework](https://moodledev.io/docs/apis/core/testing/phpunit) to automate testing and ensure plugin functionality in diverse environments.

---

### **Form API Enhancements in Moodle 4.4.3**

Moodle 4.4.3 brings further improvements to the **Form API**, especially in terms of accessibility and UX. Ensure that custom field forms are:
- **Mobile-responsive**
- **Accessible**
- **Optimized for modern browsers**

Make use of Moodle's standard form elements, ensuring that your forms adhere to accessibility guidelines.

---

### **Version Control and Deployment**

To ensure smooth development and deployment of custom field types:
- Use Moodle’s **Git version control** system.
- Maintain proper versioning to ensure compatibility with Moodle's plugin directory and version upgrades.
  
Developers should submit and maintain their plugins through the [Moodle Plugin Directory](https://moodle.org/plugins).

---

**Tags**: `mod_data`, `datafield`, `plugin`, `subplugin`

---

**Last Updated**: 2 October 2024

---

### **Key Considerations for Moodle 4.4.3:**
- Use **updated coding standards** to align with Moodle’s guidelines for PHP 8.1.
- Ensure that **security features** are in place to prevent vulnerabilities.
- Maintain **compatibility** across all supported platforms and environments.
- Follow **best practices** for creating forms and managing plugin configuration.

By adhering to these guidelines, you can ensure that your custom field types are modern, secure, and compatible with future Moodle versions.

---
