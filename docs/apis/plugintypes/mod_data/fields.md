---

### **Database Fields for Moodle 4.4.3**

---

The **Database activity** in Moodle allows the creation of structured collections of data, with support for various predefined field types such as **text**, **date**, and **URL**. Additionally, developers can create new custom field types based on specific needs, enhancing flexibility and usability for institutions, modules, or disciplines.

#### **Custom Field Types Examples:**
- **Discipline-specific field types** – e.g., “Protein PDB code” allows users to enter a PDB code and display a 3D viewer of the protein structure or link to molecular databases.
- **Institution-specific field types** – e.g., “Library reference number” enables users to input a reference number that can be converted into a direct link to local library services.
- **Module-specific field types** – e.g., “Wiki page” field provides a dropdown list of wiki pages, allowing users to link database entries to specific wiki pages.

### **File Structure for Field Sub-Plugins**
Custom database field sub-plugins are stored in `/mod/data/field`. Each plugin resides in a separate subdirectory with mandatory files as well as any additional files developers wish to include.

---

#### **Mandatory Files for Field Plugins:**

- **`field.class.php`** (Required):  
  Defines the field type, behaviors, and properties. This class should be named `data_field_[pluginname]` and extend the `data_field_base` base class.

#### **Functions in the Field Class:**
The following functions can be overridden to customize behavior:

- **`display_add_field($recordid = 0)`**  
  Returns HTML for adding or editing a record.
  
- **`display_browse_field($recordid, $template)`**  
  Returns HTML to display a record in browse mode.
  
- **`update_content($recordid, $value, $name = '')`**  
  Saves the data entered by a user for a specific record.
  
- **`get_sort_sql($fieldname)`**  
  Specifies the SQL query for sorting field data.
  
- **`get_content_value($value)`**  
  Returns the value to display in the user interface, which may differ from the raw value stored in the database.

---

### **Class Locations and Autoloading**
The field definitions for custom database fields are stored in `field.class.php` and should follow Moodle’s class structure. **Note**: Moodle 4.4.3 does not autoload these classes, so manual inclusion is still required. However, future versions of Moodle may introduce autoloading for field sub-plugins, so developers are encouraged to follow Moodle’s evolving [autoloading guidelines](https://moodledev.io/docs/guidelines/files/autoloading).

---

### **Field Configuration Form**

- **File Path**: `/mod.html` (Required)  
  This file defines the form for adding or editing the field settings. The form is generated using Moodle's Form API and includes input fields relevant to the field type being created. Ensure the form is mobile-friendly and accessible, following Moodle’s UX standards.

#### **Form Example:**
```php
$mform->addElement('text', 'fieldname', get_string('fieldname', 'datafield_[pluginname]'), 'size="30"');
$mform->setType('fieldname', PARAM_TEXT);
$mform->addRule('fieldname', null, 'required', null, 'client');
```

**Important**: The field configuration process in Moodle 4.4.3 retains legacy elements, meaning it may not use the latest coding best practices. Developers are encouraged to update and modernize these forms where necessary, in line with Moodle’s [Form API guidelines](https://moodledev.io/docs/apis/core/dml/moodleform).

---

### **Security and Best Practices**

Moodle 4.4.3 includes several security updates, making it crucial for developers to ensure that custom field types follow Moodle's security standards. This includes proper validation and sanitization of user inputs. Use functions like `required_param()` and `optional_param()` to protect against SQL injection, XSS, and other common attacks.

Example:

```php
$input = required_param('input', PARAM_ALPHANUM);  // Ensures only alphanumeric values are accepted
```

---

### **Testing and Compatibility**

Custom field types should be tested across the platforms supported by Moodle 4.4.3. This includes:

- **PHP 8.1**  
- **MariaDB 10.6.7**  
- **MySQL 8.0**  
- **PostgreSQL 13**  
- **MSSQL 2017**  
- **Oracle 19c**

Testing for performance and stability across these environments ensures compatibility and reduces the risk of issues during deployment. Developers should also use Moodle’s [unit testing framework](https://moodledev.io/docs/apis/core/testing/phpunit) to automate testing for their plugins.

---

### **Form API Updates**
Moodle continues to enhance its Form API for accessibility and improved UX. Make sure custom forms are responsive, accessible, and optimized for mobile devices. If any changes have been made to the Form API in Moodle 4.4.3, integrate them into your custom field plugins to take advantage of the improved user interface.

---

### **Version Control and Deployment**
When developing custom fields, it’s recommended to use Moodle’s Git version control system for smooth deployment and updates. Developers should also ensure that their plugins are versioned and ready for the Moodle plugins directory.

**Tags:** `mod_data`, `datafield`, `plugintype`, `subplugin`

---

**Last updated on 2 October 2024.**

---
