/**
 * Initialise the js strings required for this plugin.
 */
function atto_media_strings_for_js(): void {
    global $PAGE;

    $PAGE->requires->strings_for_js([
        'add',
        'width',
    ], 'atto_media');
}

/**
 * Sends the parameters to the JS module.
 *
 * @return array
 */
function atto_media_params_for_js(): array {
    global $OUTPUT, $PAGE;
    $currentlang = current_language();
    $langsinstalled = get_string_manager()->get_list_of_translations(true);
    $params = [
        'langs' => [
            'installed' => [],
        ],
    ];

    foreach ($langsinstalled as $code => $name) {
        $params['langs']['installed'][] = [
            'lang' => $name,
            'code' => $code,
            'default' => $currentlang == $code,
        ];
    }

    return $params;
}
