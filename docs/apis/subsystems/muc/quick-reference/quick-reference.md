---
title: Quick reference
tags:
    - API
    - Subsystem
    - MUC
---

This is a quick reference lookup for the Cache API.
More detail can be found on the [Cache API](./) page as well as a friendly explanation of the API.

## Using a cache object

### Getting a cache instance for a definition

```php
// Most basic
$cache = cache::make('component', 'area');

// Using identifiers
$cache = cache::make('component', 'area', array('dbfamily' => 'pgsql'));
```

### Getting an ad-hoc cache instance {/* #get-an-ad-hoc-cache-instance */}

Using cache definitions is the recommended method. Ad-hoc caches should only be used where you have a rarely used cache, or insignificant cache. Typical use-case can be when you are refactoring some local static variables into MODE_REQUEST caches.

```php
// Application cache
$cache = cache::make_from_params(cache_store::MODE_APPLICATION, 'component', 'area');

// Session cache
$cache = cache::make_from_params(cache_store::MODE_SESSION, 'component', 'area');

// Request cache
$cache = cache::make_from_params(cache_store::MODE_REQUEST, 'component', 'area');

// Using identifiers
$cache = cache::make_from_params(cache_store::MODE_APPLICATION, 'component', 'area',
array('dbfamily' => 'pgsql'));

// Using persistence so that the cache instance is stored for future use/request
$cache = cache::make_from_params(cache_store::MODE_APPLICATION, 'component', 'area', array(),
array('persistent' => true));

// Using a request cache to replace static variable
$cache = cache::make_from_params(cache_store::MODE_REQUEST, 'component', 'area', array(),
array('simplekeys' => true, 'simpledata' => true));
```

### Get a key {/* #get-a-key */}

If you have many keys to retrieve you should use [get_many](#get-many-keys-at-once).

```php
// Get a cache instance
$cache = cache::make('component', 'area');

// Key can be an int or string
$data = $cache->get('key');

// Data returned will be whatever was stored, or false if it was not in the cache.
```

### Get many keys at once {/* #get-many-keys-at-once */}

Not all cache stores will support fetching many keys at once, some stores will take the array of keys and process them one by one.
If you have many keys to fetch it is recommended to use this still as cache stores that do support this will likely perform better.

```php
$cache = cache::make('component', 'area');

// Set some data so I can show results
$cache->set('key1', 'data1');
$cache->set('key3', 'data3');

// Keys can be an int or string
$keys = array(
'key1',
'key2',
'key3'
);
$results = $cache->get_many($keys);

print_r($results);

// Will print the following:
// array(
//     'key1' => 'data1',
//     'key2' => false,
//     'key3' => 'data3'
// )
```

### Get a versioned key {/* #get-a-versioned-key */}

If cache keys are versioned, pass in the cache revision as well as the key.
Both the `course` and `course_module` tables have a `cacherev` column.

If you have many versioned keys to retrieve you should use [get_many_versioned](#get-many-versioned-keys-at-once).

```php
// Get a cache instance
$cache = cache::make('component', 'area');

// Key can be an int or string
$data = $cache->get_versioned('key', $cacherev);

// Data returned will be what ever was stored, or false if it was not in the cache.
```

### Get many versioned keys at once {/* #get-many-versioned-keys-at-once */}

If cache keys are versioned, pass in the cache revision as well as the key.

```php
// Get a cache instance
$cache = cache::make('component', 'area');

// Associative array of key/version.
$cachekeys = [
    'key1' => 1781531309,
    'key2' => 1781531349,
    'key3' => 1781531357,
];

$data = $cache->get_many_versioned($cachekeys);

// Returns an associative array of [key => value] for warm, version-matched items.
```

### Store a key {/* #store-a-key */}

If you have many items to store you should use [set_many](#store-many-keys-at-once).

```php
// Get a cache instance
$cache = cache::make('component', 'area');

// Key can be an int or string
// Data can be anything
$result = $cache->set('key', 'data');

// Result will be true on success, false otherwise.
```

### Store many keys at once {/* #store-many-keys-at-once */}

Note not all stores will support setting several items in a single transaction, stores that don't will process each item of the array separately.
It is still recommended to use this method if you have many items to set as those stores that do support it will likely perform better.

```php
// Get a cache instance
$cache = cache::make('component', 'area');

// Prepare an associative array of key => value pairs.
// Key can be an int or string
// Data can be anything
$data = array(
'key1' => 'data1',
'key3' => 'data3'
);

// Use set_many
$result = $cache->set_many($data);

// Result will be an int, the number of items successfully set.
```

### Store a versioned key {/* #store-a-versioned-key */}

```php
// Get a cache instance
$cache = cache::make('component', 'area');

// Key can be an int or string
// Cache revision should be an int
// Data can be anything
$result = $cache->set_versioned('key', 1781531357, 'data');

// Result will be true on success, false otherwise.
```

### Delete a key {/* #delete-a-key */}

If you have several keys you want to delete you should use [delete_many](#delete-many-keys-at-once). If you want to delete everything you should use [purge](#delete-all-keys).

```php
// Get a cache instance
$cache = cache::make('component', 'area');

// Key can be an int or string
$result = $cache->delete('key');

// Result will be true on success, false otherwise.
```

### Delete many keys at once {/* #delete-many-keys-at-once */}

```php
// Get a cache instance
$cache = cache::make('component', 'area');

// Array of Keys can be an int or string
$keys = array('key1', 'key2');

$result = $cache->delete_many($keys);
// $result will contain the number of items successfully deleted.
```

### Delete all keys {/* #delete-all-keys */}

It is not recommended to purge unless absolutely required, this will cause the store (plugin instance) being used by your cache to be purged. Not all stores can tell which keys belong to your cache and in that circumstance all keys in the store are deleted, not just the keys belonging to your cache, also the keys belonging to other caches using that same store.

```php
// Get a cache instance
$cache = cache::make('component', 'area');

$result = $cache->purge();
// $result will contain the number of items successfully deleted.
```

### Create a definition {/* #create-a-definition */}

Basic definition with just the required mode:

```php
$definitions = array(
// The name of the cache area is the key. The component/plugin will be picked up from the file location.
'area' => array(
// [int] Required; Sets the mode for the definition. Must be one of cache_store::MODE_*
'mode' => cache_store::MODE_*,
)
);
```

Advanced definition:

```php
$definitions = array(
// The name of the cache area is the key. The component/plugin will be picked up from the file location.
'area' => array(
// [int] Required; Sets the mode for the definition. Must be one of cache_store::MODE_*
'mode' => cache_store::MODE_*,

        // All of the following options are default

        // [bool] Set to true if your cache will only use simple keys for its items.
        // Simple keys consist of digits, underscores and the 26 chars of the english language. a-zA-Z0-9_
        // If true the keys won't be hashed before being passed to the cache store for gets/sets/deletes. It will be
        // better for performance and possible only because we know the keys are safe.
        'simplekeys' => false,

        // [bool] If set to true we know that the data is scalar or array of scalar.
        'simpledata' => false,

        // [array] An array of identifiers that must be provided to the cache when it is created.
        'requireidentifiers' => array('ident1', 'ident2'),

        // [bool] If set to true then only stores that can guarantee data will remain available once set will be used.
        'requiredataguarantee' => false,

        // [bool] If set to true then only stores that support multiple identifiers will be used.
        'requiremultipleidentifiers' => false,

        // [bool] If set to true then a lock will be gained before reading from the cache store. It is recommended not to use
        // this setting unless 100% absolutely positively required. Remember 99.9% of caches will NOT need this setting.
        // This setting will only be used for application caches presently.
        'requirelockingread' => false,

        // [bool] If set to true then a lock will be gained before writing to the cache store. As above this is not recommended
        // unless truly needed. Please think about the order of your code and deal with race conditions there first.
        // This setting will only be used for application caches presently.
        'requirelockingwrite' => false,

        // [int] If set this will be used as the maximum number of entries within the cache store for this definition.
        // Its important to note that cache stores don't actually have to acknowledge this setting or maintain it as a hard limit.
        'maxsize' => null,

        // [string] A class to use as the loader for this cache. This is an advanced setting and will allow the developer of the
        // definition to take 100% control of the caching solution.
        // Any class used here must inherit the cache_loader interface and must extend default cache loader for the mode they are using.
        'overrideclass' => null,

        // [string] Supplements the above setting indicated the file containing the class to be used. This file is included when required.
        'overrideclassfile' => null,

        // [string] A class to use as the data loader for this definition.
        // Any class used here must inherit the cache_data_loader interface.
        'datasource' => null,

        // [string] Suplements the above setting indicated the file containing the class to be used. This file is included when required.
        'datasourcefile' => null,

        // [bool] This setting does two important things. First it tells the cache API to only instantiate the cache structure for
        // this definition once, further requests will be given the original instance.
        // Second the cache loader will keep an array of the items set and retrieved to the cache during the request.
        // This has several advantages including better performance without needing to start passing the cache instance between
        // function calls, the downside is that the cache instance + the items used stay within memory.
        // Consider using this setting when you know that there are going to be many calls to the cache for the same information
        // or when you are converting existing code to the cache and need to access the cache within functions but don't want
        // to add it as an argument to the function.
        'staticacceleration' => false,

        // [int] This supplements the above setting by limiting the number of items in the caches persistent array of items.
        // Tweaking this setting lower will allow you to minimise the memory implications above while hopefully still managing to
        // offset calls to the cache store.
        'staticaccelerationsize' => null,

        // [int] A time to live for the data (in seconds). It is strongly recommended that you don't make use of this and
        // instead try to create an event driven invalidation system.
        // Not all cache stores will support this natively and there are undesired performance impacts if the cache store does not.
        'ttl' => 0,

        // [bool] If set to true only the mapped cache store(s) will be used and the default mode store will not. This is a super
        // advanced setting and should not be used unless absolutely required. It allows you to avoid the default stores for one
        // reason or another.
        'mappingsonly' => false,

        // [array] An array of events that should cause this cache to invalidate some or all of the items within it.
        'invalidationevents' => array('event1', 'event2'),

        // [int] The sharing options that are appropriate for this definition. Should be the sum of the possible options.
        'sharingoptions' => cache_definition::SHARING_DEFAULT,

        // [int] The default sharing option to use. It's highly recommended that you don't set this unless there is a very
        // specific reason not to use the system default.
        'defaultsharing' => cache_definition::SHARING_DEFAULT,
    )
);
```

A better explanation of the cache definition can be found on the [Cache API](./) page

## Invalidating keys from a cache {/* #invalidating-keys-from-a-cache */}

### Invalidate keys using an event {/* #invalidate-keys-using-an-event */}

```php
cache_helper::invalidate_by_event('event1', array('key1', 'key2'));
```

### Invalidate keys by definition {/* #invalidate-keys-by-definition */}

```php
// Identifiers for the definitions
$identifiers = array(
'ident1' => 'something'
);

// Keys to invalidate
$keys = array('key1', 'key2');

cache_helper::invalidate_by_definition('component', 'area', $identifiers, $keys);
```

## Invalidating the modinfo cache {/* #invalidating-the-modinfo-cache */}

This only applies to the `coursemodinfo` cache component.
We do not delete `coursemodinfo` cache items, only increment the revision to invalidate them.

### Invalidate a single course module {/* #invalidate-a-single-course-module */}

```php
// Pass true for $rebuildcourse to trigger an immediate partial course rebuild.
course_modinfo::invalidate_module_cache('coursemoduleid', 'courseid', true);
```

If several module caches are invalidated in a loop, omit the third parameter and call [rebuild_course_cache](#rebuild-course-cache)
afterwards.

### Invalidate many course modules at once {/* #invalidate-many-course-modules-at-once */}

Modules are invalidated in a loop, with the option to perform a partial rebuild right away.

```php
$cmids = [$cm1id, $cm2id, $cm3id];

// Pass true for $rebuildcourse to trigger an immediate partial course rebuild.
course_modinfo::invalidate_module_caches($cmids, 'courseid', true);
```

If an immediate rebuild is not required, omit the third parameter and call [rebuild_course_cache](#rebuild-course-cache)
separately later on.

### Rebuild course cache {/* #rebuild-course-cache */}

```php
// Optionally clear the cache or trigger a partial rebuild.
rebuild_course_cache(int $courseid = 0, bool $clearonly = false, bool $partialrebuild = false);
```
