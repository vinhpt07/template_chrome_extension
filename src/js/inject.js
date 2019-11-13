/**
 * code in inject.js
 * added "web_accessible_resources": ["injected.js"] to manifest.json
 */

import {default as effect} from './modules/injected';
import helpers from './modules/helpers';

helpers.injectCode(effect,true);
