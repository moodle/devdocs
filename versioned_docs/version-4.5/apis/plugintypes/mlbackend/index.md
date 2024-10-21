---
title: Machine learning backends
tags:
  - Analytics
  - API
  - plugintype
---

<!-- cspell:ignore tensorboard -->
<!-- cspell:ignore moodlemlbackend -->

Machine learning backends process the datasets generated from the indicators and targets calculated by the [Analytics API](../../subsystems/analytics/index.md). They are used for machine learning training, prediction and models evaluation.

:::tip

We strongly recommend that you read the [Analytics API](../../subsystems/analytics/index.md) documentation to help understand the core concepts, how they are implemented in Moodle, and how machine learning backend plugins fit into the analytics API.

:::

The communication between machine learning backends and Moodle is through files because the code that will process the dataset can be written in PHP, in Python, in other languages or even use cloud services. This needs to be scalable so they are expected to be able to manage big files and train algorithms reading input files in batches if necessary.

## Backends included in Moodle core

### PHP

The **PHP backend** is the default predictions processor as it is written in PHP and does not have any external dependencies. It is using logistic regression.

### Python

The **Python backend** requires *python* binary (either python 2 or python 3) and [moodlemlbackend python package](https://pypi.python.org/pypi?name=moodlemlbackend&version=0.0.5&:action=display) which is maintained by Moodle HQ.

The Python version and libraries versions used are **very important**. We recommend using Python 3.7 for mlbackend 3.x versions.

The Python backend is based on [Google's tensorflow library](https://www.tensorflow.org/) and uses a feed-forward neural network with 1 single hidden layer.

The *moodlemlbackend* package does store model performance information that can be visualised using [tensorboard](https://www.tensorflow.org/get_started/summaries_and_tensorboard). Information generated during models evaluation is available through the models management page, under each model *Actions > Log* menu.

:::tip

We recommend use of the **Python** backend as it is able to predict more accurately than the PHP backend and it is faster.

:::

:::info

You can [view the source](https://github.com/moodlehq/moodle-mlbackend-python) of the _moodlemlbackend_ library that Moodle uses.

:::

## File structure

Machine learning backends are located in the `lib/mlbackend` directory.

Each plugin is in a separate subdirectory and consists of a number of _mandatory files_ and any other files the developer is going to use.

<details>
  <summary>View an example directory layout for the `mlbackend_python` plugin.</summary>

```console
lib/mlbackend/python
├── classes
│   ├── privacy
│   │   └── provider.php
│   └── processor.php
├── lang
│   └── en
│       └── mlbackend_python.php
├── phpunit.xml
├── settings.php
├── tests
│   └── processor_test.php
├── upgrade.txt
└── version.php
```

</details>

Some of the important files for the mlbackend plugintype are described below. See the [common plugin files](../commonfiles) documentation for details of other files which may be useful in your plugin.

## Interfaces

A summary of these interfaces purpose:

- Evaluate a provided prediction model
- Train machine learning algorithms with the existing site data
- Predict targets based on previously trained algorithms

### Predictor

This is the basic interface to be implemented by machine learning backends. Two main types are, *classifiers* and *regressors*. We provide the *Regressor* interface but it is not currently implemented by core Machine learning backends. Both of these are supervised algorithms. Each type includes methods to train, predict and evaluate datasets.

You can use **is_ready** to check that the backend is available.

```php
/**
 * Is it ready to predict?
 *
 * @return bool
 */
public function is_ready();
```

**clear_model** and **delete_output_dir** purpose is to clean up stuff created by the machine learning backend.

```php
/**
 * Delete all stored information of the current model id.
 *
 * This method is called when there are important changes to a model,
 * all previous training algorithms using that version of the model
 * should be deleted.
 *
 * @param string $uniqueid The site model unique id string
 * @param string $modelversionoutputdir The output dir of this model version
 * @return null
 */
public function clear_model($uniqueid, $modelversionoutputdir);

/**
 * Delete the output directory.
 *
 * This method is called when a model is completely deleted.
 *
 * @param string $modeloutputdir The model directory id (parent of all model versions subdirectories).
 * @param string $uniqueid The site model unique id string
 * @return null
 */
public function delete_output_dir($modeloutputdir, $uniqueid);
```

### Classifier

A [classifier](https://en.wikipedia.org/wiki/Statistical_classification) sorts input into two or more categories, based on analysis of the indicators. This is frequently used in binary predictions, e.g. course completion vs. dropout. This machine learning algorithm is "supervised": It requires a training data set of elements whose classification is known (e.g. courses in the past with a clear definition of whether the student has dropped out or not). This is an interface to be implemented by machine learning backends that support classification. It extends the *Predictor* interface.

Both these methods and *Predictor* methods should be implemented.

```php
/**
 * Train this processor classification model using the provided supervised learning dataset.
 *
 * @param string $uniqueid
 * @param \stored_file $dataset
 * @param string $outputdir
 * @return \stdClass
 */
public function train_classification($uniqueid, \stored_file $dataset, $outputdir);

/**
 * Classifies the provided dataset samples.
 *
 * @param string $uniqueid
 * @param \stored_file $dataset
 * @param string $outputdir
 * @return \stdClass
 */
public function classify($uniqueid, \stored_file $dataset, $outputdir);

/**
 * Evaluates this processor classification model using the provided supervised learning dataset.
 *
 * @param string $uniqueid
 * @param float $maxdeviation
 * @param int $niterations
 * @param \stored_file $dataset
 * @param string $outputdir
 * @param  string $trainedmodeldir
 * @return \stdClass
 */
public function evaluate_classification($uniqueid, $maxdeviation, $niterations, \stored_file $dataset, $outputdir);
```

### Regressor

A [regressor](https://en.wikipedia.org/wiki/Regression_analysis) predicts the value of an outcome (or dependent) variable based on analysis of the indicators. This value is linear, such as a final grade in a course or the likelihood a student is to pass a course. This machine learning algorithm is "supervised": It requires a training data set of elements whose classification is known (e.g. courses in the past with a clear definition of whether the student has dropped out or not). This is an interface to be implemented by machine learning backends that support regression. It extends *Predictor* interface.

Both these methods and *Predictor* methods should be implemented.

```php
/**
 * Train this processor regression model using the provided supervised learning dataset.
 *
 * @param string $uniqueid
 * @param \stored_file $dataset
 * @param string $outputdir
 * @return \stdClass
 */
public function train_regression($uniqueid, \stored_file $dataset, $outputdir);

/**
 * Estimates linear values for the provided dataset samples.
 *
 * @param string $uniqueid
 * @param \stored_file $dataset
 * @param mixed $outputdir
 * @return void
 */
public function estimate($uniqueid, \stored_file $dataset, $outputdir);


/**
 * Evaluates this processor regression model using the provided supervised learning dataset.
 *
 * @param string $uniqueid
 * @param float $maxdeviation
 * @param int $niterations
 * @param \stored_file $dataset
 * @param string $outputdir
 * @param  string $trainedmodeldir
 * @return \stdClass
 */
public function evaluate_regression($uniqueid, $maxdeviation, $niterations, \stored_file $dataset, $outputdir);
```
