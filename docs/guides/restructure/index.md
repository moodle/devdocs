---
title: Code Restructure
tags:
  - MDL-83424
  - Directory Restructure
---

<Since version="5.1" issueNumber="MDL-83424" />

In version 5.1, Moodle started the process of restructuring its codebase into different directories.

In the initial phase most code has been moved out of the directory root, and into a `public` directory.

For the most part this change has minimal impact on developers. Most existing tooling has already been updated to support the new locations of plugins, however some changes may be required.

## Moodle reconfiguration

In almost all cases there is no need to reconfigure Moodle at all for this change. The existing `$CFG->wwwroot` should continue to behave as before, as should the `$CFG->dirroot`.

A new read-only variable, `$CFG->root` has been introduced which points to the root of the Moodle installation.

## Web server reconfiguration

The purpose of this restructure is to move all web-accessible content into a new `public` directory, which in turn allows Moodle to have content which is _not_ web accessible. In the future this will be used to support installation of other software which should not be publicly available.

This change will require some reconfiguration of web servers.

For production systems which only need to do deal with individually configured Moodle systems, or a set of Moodle sites hosted in identical environments, this change should be minimal. It usually requires the reconfiguration of the `DocumentRoot` directive in Apache, or the `root` directive in nginx.

<Tabs groupId="webserver">
  <TabItem value="apache" label="Updating Apache" default>
  ```diff title="Updating the Apache DocumentRoot"
  --- a/httpd.conf
  +++ b/httpd.conf
  -    DocumentRoot /srv/moodle
  +    DocumentRoot /srv/moodle/public
  ```
  </TabItem>
  <TabItem value="nginx" label="Updating Nginx">
  ```diff title="Updating the Nginx Root"
  --- a/nginx.conf
  +++ b/nginx.conf
  -    root /srv/moodle;
  +    root /srv/moodle/public;
  ```
  </TabItem>
</Tabs>

### Developer configuration examples

For developer systems it is reasonably common to switch between a wide variety of Moodle versions and configurations.

The following configurations allow developers to support multiple versions of Moodle from within subdirectories, without manual mapping of the paths. For example:

| `$CFG->wwwroot` | Web Root |
| --- | --- |
| `https://example.com/m405` | `/srv/moodle/m405` |
| `https://example.com/m500` | `/srv/moodle/m500` |
| `https://example.com/m501` | `/srv/moodle/m501/public` |

In addition to the directory configuration, this configuration also supports:

- SSL
- The Moodle Router

This configuration is broken into two files:

- a `moodle_listeners.conf` which can be included from the your main configuration file, and which allows the overall configuration of the listeners; and
- a `moodle_listener.conf` which contains the individual listener configuration.

This makes it easier to support SSL configuration on your server.

:::tip Generating SSL Certificates

If you have a domain that you control, you may be able to use a DNS-based CertBot plugin such as [Route53](https://certbot-dns-route53.readthedocs.io/en/stable/) or [Cloudflare](https://certbot-dns-cloudflare.readthedocs.io/en/stable/).

:::

<Tabs groupId="webserver">

  <TabItem value="apache" label="Apache Developer configuration example" default>

```apacheconf title="moodle_listeners.conf"
<VirtualHost [YOUR_SERVERNAME]:80>
Include /opt/homebrew/etc/moodle_listener.conf
</VirtualHost>

<VirtualHost [YOUR_SERVERNAME]:443>
# So you have an SSL Certificate?
# Set the details below.
SSLEngine on
SSLCertificateFile      "/etc/letsencrypt/live/[YOUR_HOSTNAME]/fullchain.pem"
SSLCertificateKeyFile   "/etc/letsencrypt/live/[YOUR_HOSTNAME]/privkey.pem"

Include /opt/homebrew/etc/httpd/moodle_listener.conf
</VirtualHost>

```

```apacheconf title="moodle_listener.conf"
#######################################
# The file is used to handle Moodle sites served from a sub folder of the domain.
#######################################

#######################################
# Things you need to set up before using this configuration:
#######################################

# Update your configuration to match the host name(s) that you use.
# You can have as many as you like and/or require.
#######################
# UPDATE ME
ServerName [YOUR_SERVERNAME]
#######################

# You can add any aliases you like here too.
# You probably want to keep this one though.
ServerAlias localhost

# Set the root directory for your Moodle sites.
# You need to set it in a few places below too.
#######################
# UPDATE ME
DocumentRoot /srv/moodle
#######################

# Configure the directory configuration.
#######################
# UPDATE ME
<Directory /srv/moodle>
#######################
    # Do not allow directory listing.
    # Allow following symbolic links.
    Options -Indexes +FollowSymLinks
    # Do not allow .htaccess files to override settings.
    AllowOverride None
    # Allow access to all users.
    Require all granted
</Directory>

# Repeat the same for any public folder too.
#######################
# UPDATE ME
<DirectoryMatch "^/srv/moodle/[^/]+(/public)?$">
#######################
    Options -Indexes +FollowSymLinks
    AllowOverride None
    Require all granted
</DirectoryMatch>

<IfModule mod_rewrite.c>
    RewriteEngine On

    # Enable rewrite logging for debugging purposes.
    # LogLevel warn mod_rewrite.c:trace7

    #######################
    # UPDATE ME
    # Route through a known fixed folder
    DocumentRoot "/srv/moodle"
    #######################

    # Use mod_rewrite to handle requests.
    # We cannot use FallbackResource here because we need to check if the /public folder exists.
    RewriteEngine On

    #####################
    # Ruleset 1.
    # Check if this request is for a site which has a public folder.
    #####################
    # Check whether the requested file exists as-is.
    RewriteCond %{SCRIPT_FILENAME} !-f
    # Extract the top-level folder from the request URI. This is the Moodle site name.
    RewriteCond %{REQUEST_FILENAME} ^/([^/]+)(/.*)?$
    # If the public folder exists for that site, rewrite the request to go through it.
    RewriteCond %{DOCUMENT_ROOT}/%1/public -d
    RewriteRule ^/([^/]+)(/.*)?$ /$1/public$2 [C]   # Rewrite to public folder - CHAIN to the next rule.

        #####################
        # Ruleset 1.1.
        # The public folder exists.
        # See if we can access the file directly.
        # If not, rewrite to the r.php (router) inside the site/public folder.
        #####################
        # Extract the file path before the .php extension, if any (pathinfo removed).
        RewriteCond %{REQUEST_FILENAME} ^(.+\.php)?(/.*)?$
        # AND the requested file does not exist as-is.
        # The %1 is the file path before the .php extension, if any (pathinfo removed).
        # It is fetched from the RewriteCond above.
        # %2 is the pathinfo, if any.
        RewriteCond %{DOCUMENT_ROOT}%1 !-f
        # AND the requested URI is not a file.
        # $1 is the site name, $2 is the file path.
        # These come from the RewriteRule below that this rule applies to.
        RewriteCond %{DOCUMENT_ROOT}/$1$2 !-f
        # AND the requested URI is not a directory.
        RewriteCond %{DOCUMENT_ROOT}/$1$2 !-d
        # Rewrite the request to go through the r.php (router) in the site/public folder.
        RewriteRule ^/([^/]+)(/.*)?$ /$1/public/r.php [L]

    #####################
    # Rule set 2.
    # The public folder does _not_ exist.
    # See if we can access the file directly.
    # If not, rewrite to the r.php (router) in the site folder.
    #####################
    # Check whether the requested file exists as-is.
    RewriteCond %{SCRIPT_FILENAME} !-f
    # Extract the top-level folder from the request URI. This is the Moodle site name.
    RewriteCond %{REQUEST_FILENAME} ^/([^/]+)(/.*)?$
    # If the public folder DOES NOT exist for that site.
    RewriteCond %{DOCUMENT_ROOT}/%1/public !-d
    # Extract the file path before the .php extension, if any (pathinfo removed).
    RewriteCond %{REQUEST_FILENAME} ^(.+\.php)?(/.*)?$
    # AND the requested file does not exist as-is.
    # The %1 is the file path before the .php extension, if any (pathinfo removed).
    # It is fetched from the RewriteCond above.
    # %2 is the pathinfo, if any.
    RewriteCond %{DOCUMENT_ROOT}%1 !-f
    # AND the requested URI is not a file.
    # $1 is the site name, $2 is the file path.
    # These come from the RewriteRule below that this rule applies to.
    RewriteCond %{DOCUMENT_ROOT}/$1$2 !-f
    # AND the requested URI is not a directory.
    RewriteCond %{DOCUMENT_ROOT}/$1$2 !-d
    # Rewrite the request to go through the r.php (router) in the site folder.
    RewriteRule ^/([^/]+)(/.*)?$ /$1/r.php [L]

    #######################
    # UPDATE ME
    <Directory "/srv/moodle">
    #######################
        # Follow symbolic links.
        Options FollowSymLinks
        # Do not allow .htaccess files to override settings.
        AllowOverride None
        # Allow access to all users.
        Require all granted
        # Set the index file.
        DirectoryIndex index.php
    </Directory>
</IfModule>

<IfModule dir_module>
    DirectoryIndex index.php index.html
</IfModule>

<FilesMatch \.php$>
    SetHandler application/x-httpd-php
</FilesMatch>
```

  </TabItem>
  <TabItem value="nginx" label="Nginx Developer configuration example">

```nginx title="moodle_listeners.conf"
#######################################
# The file is used to handle Moodle sites served from a sub folder of the domain.
#######################################

# We use this map to extract the original site name from the URI.
# Maps are fetched once per request and are not re-processed.

map $uri $original_site {
    ~^/([^/]+)     $1;
    default        "";
}

# This is the HTTP server block.

# There should be nothing to change here.

server {
    listen              80;
    listen              [::]:80;

    include blocks/moodle_listener.conf;
}

# This is the HTTPS server block.

# If you do not have an SSL certificate, you can comment this out.

# I'd recommend using Let's Encrypt for free SSL certificates if you are able to.

server {
    listen              443 ssl;
    listen              [::]:443 ssl;

    # So you have an SSL Certificate?
    # Set the details below.
    ssl_certificate     "/etc/letsencrypt/live/[YOUR_HOSTNAME]/fullchain.pem";
    ssl_certificate_key "/etc/letsencrypt/live/[YOUR_HOSTNAME]/privkey.pem";
    ssl_protocols       TLSv1 TLSv1.1 TLSv1.2 TLSv1.3;
    ssl_ciphers         HIGH:!aNULL:!MD5;

    include blocks/moodle_listener.conf;
}

```

```nginx title="blocks/moodle_listener.conf"
#######################################
# The file is used to handle Moodle sites served from a sub folder of the domain.
#######################################

#######################################
# Things you need to set up before using this configuration:
#######################################

# Update your configuration to match the host name(s) that you use.
# You can have as many as you like and/or require.
server_name         [YOUR_HOSTNAME];

# You probably want to keep this one though.
server_name         localhost;

# Set the root directory for your Moodle sites.
set $root /srv/moodle;

# This is the fastCGI host and port.
# If you are using PHP-FPM, this is usually 127.0.0.1:9000.
set $fastcgihost 127.0.0.1:9000;

# This is the path to your error logs.
error_log  /opt/homebrew/var/log/nginx/error.log;

# If you are debugging, you can uncomment the line below to enable debug logging.
# error_log  /opt/homebrew/var/log/nginx/error.log debug;

#######################################
# Nothing below this line should need to be changed.
#######################################

# Set the index file to be used.
index index.php;

# Extract the site name and relative path from URI
if ($uri ~ ^/(?<site>[^/]+)) {
    set $site $site;
}

# If we are still in the original site, rewrite the URI to remove the site name.
# Note: this is an _internal_ rewrite, so it does not change the URL in the browser.
if ($original_site = $site) {
rewrite ^/(?<site>[^/]+)/?(?<relpath>/.+)?$ /$relpath last;
}

# if the path has no trailing slash after removing the site name, add it.
rewrite ^$ / last;

# Try to serve the requested file or directory, otherwise fall back to the Moodle router.
try_files $uri $uri/ /r.php;

# This block handles all requests for PHP or fallback
location / {
    # Check if the requested site actually exists.
    if (!-d $root/$original_site) {
        return 404;
    }

    # Use public directory if it exists
    set $docroot "$root/$original_site";
    if (-d "$root/$original_site/public") {
        set $docroot "$root/$original_site/public";
    }
    root $docroot;

    # Try to serve the requested file or directory, otherwise fall back to the Moodle router.
    # This is different to the version below in the .php location because this one handles where a non-php file is requested.
    try_files $uri $uri/ /r.php;

    if (!-e $request_filename) {
        # If the requested file does not exist, rewrite to the Moodle router.
        rewrite ^ /r.php last;
    }

    location ~ \.php {
        # Set the document root for PHP files.
        # Note: This is the same as the root above, but we need to set it again for the PHP location.
        # The set is not inheritted from the parent location.
        # This is not documented in the Nginx documentation -- it's documented in the nginx source code.
        set $docroot "$root/$original_site";
        if (-d "$root/$original_site/public") {
            set $docroot "$root/$original_site/public";
        }
        root $docroot;

        # Use fastcgi_split_path_info to handle PHP scripts
        # This directive defines a regular expression that captures a value for the $fastcgi_path_info variable.
        fastcgi_split_path_info ^(.+\.php)(/.*)$;

        # Save path_info before try_files resets it.
        # When we use try_files, it can overwrite the $fastcgi_path_info variable.
        # We store it in a separate variable to preserve it.
        set $path_info $fastcgi_path_info;

        # Try the requested file, then the requested directory, then fall back to the Moodle router.
        try_files $fastcgi_script_name $fastcgi_script_name/ /r.php;

        include fastcgi_params;
        fastcgi_param PATH_INFO $path_info;
        fastcgi_param SCRIPT_NAME /$original_site$fastcgi_script_name;
        fastcgi_param SCRIPT_FILENAME $docroot$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $docroot;
        fastcgi_pass  $fastcgihost;
        fastcgi_index index.php;
    }
}
```

  </TabItem>
</Tabs>
