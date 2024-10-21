<!-- markdownlint-disable first-line-heading -->
Moodle requires that you create a table for your plugin whose name exactly matches the plugin name. For example, the `certificate` activity module _must_ have a database table named `certificate`. Certain fields within this table are
also _required_:

| Field name     | Properties               | Keys / Indexes                    | Notes                                                                                    |
| ---            | ---                      | ---                               | ---                                                                                      |
| `id`           | `INT(10), auto sequence` | primary key for the table         |                                                                                          |
| `course`       | `INT(10)`                | foreign key to the `course` table |                                                                                          |
| `name`         | `CHAR(255)`              |                                   | Holds the user-specified name of the activity instance                                   |
| `timemodified` | `INT(10)`                |                                   | The timestamp of when the activity was last modified                                     |
| `intro`        | `TEXT`                   |                                   | A standard field to hold the user-defined activity description (see `FEATURE_MOD_INTRO`) |
| `introformat`  | `INT(4)`                 |                                   | A standard field to hold the format of the field                                         |
