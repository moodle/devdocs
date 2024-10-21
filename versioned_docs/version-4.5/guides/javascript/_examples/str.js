import {getString} from 'core/str';

getString('close', 'core')
.then((closeString) => {
    window.console.log(closeString);

    return closeString;
})
.catch();
