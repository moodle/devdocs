---
title: Transactions
tags:
  - core_dml
  - DML
  - core
  - API
---

Moodle allows data manipulation to take place within a database transaction, known as a *Delegated transaction*. This allows you to perform CRUD[^1] operations, and roll them back if a failure takes place.

## General principles

1. These **delegated transactions** work in a way that, when nested, the outer levels have control over the inner ones.
2. Code should **not** rely on a rollback happening. It is only a measure to reduce (not to eliminate) DB[^2] garbled information
3. Any code using transactions that result in unfinished, unbalanced, or finished twice transactions will generate a `transaction_exception` and the DB will perform a rollback
4. If one transaction (at any level) has been marked for `rollback()` there will not be any method to change it. Finally Moodle will perform the DB rollback
5. If one transaction (at any level) has been marked for `allow_commit()` it will be possible to change that status to `rollback()` in any outer level
6. It will be **optional** to catch exceptions when using transactions, but if they are caught, then it is mandatory to mark the transaction for `rollback()`
7. Any explicit `rollback()` call will pass the exception originating from it, as in `rollback($exception)`, to be re-thrown

## The API

1. All the handling must go, exclusively, to a `moodle_database` object, leaving real drivers only implementing (protected) the old begin/commit/rollback_sql() functions
2. One array of objects of type `moodle_transaction` will be stored / checked from `$DB`
3. `$DB` will be the responsible to instantiate / accumulate / pair / compare `moodle_transaction`s
4. Each `moodle_transaction` will be able to set the global mark for rollback. Commit won't change anything
5. Inner-most commit/rollback will printout one complete stack of `moodle_transaction`s information if we are under `DEBUG_DEVELOPER` and the new setting `delegatedtransactionsdebug` is enabled
6. Normal usage of the moodle_transaction will be:

    ```php
    $transaction = $DB->start_delegated_transaction();
    // Perform some $DB stuff
    $transaction->allow_commit();
    ```

7. If, for any reason, the developer needs to catch exceptions when using transactions, it will be mandatory to use it in this way:

    ```php
    try {
        $transaction = $DB->start_delegated_transaction();
        // Perform some $DB stuff.
        $transaction->allow_commit();
    } catch (Exception $e) {
        // Extra cleanup steps.
        // Re-throw exception after commiting.
        $transaction->rollback($e);
    }
    ```

8. In order to be able to keep some parts of code out from top transactions completely, if we know it can lead to problems, we can use:

    ```php
    // Check to confirm we aren't using transactions at this point.
    // This will throw an exception if a transaction is found.
    $DB->transactions_forbidden();
    ```

## The Flow

![The flow of transactions in diagram format](./_delegated-transactions/TransactionsAndExceptionsFlow.png)

1. Any default exception handler will:
    1. Catch uncaught transaction_exception exceptions
    2. Properly perform the DB rollback
    3. debug/error/log honouring related settings
    4. inform with as many details as possible (token, place... whatever)
2. Any "footer" (meaning some place before ending `<html>` output) will:
    1. Detect "in-transaction" status
    2. Let execution continue, transaction is automatically rolled back in `$DB->dispose()`
    3. inform with as many details as possible (token, place... whatever)
3. `$DB->dispose()` will:
    1. Detect "in-transaction" status
    2. log error (not possible to honour settings!)
    3. Properly perform the full DB rollback

[^1]: Create Read Update Delete
[^2]: The Moodle database
