
'use strict';
const _s = require('underscore.string');
const isScoped = require('is-scoped');

export const repoName = (name:string) => isScoped(name) ? name.split('/')[1] : name;
export const slugifyPackageName = (name:string) => isScoped(name) ? name : _s.slugify(name);
