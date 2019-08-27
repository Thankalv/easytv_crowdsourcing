/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

module.exports.routes = {

    'GET /':                             { action: 'homepage' },
    'GET /about':                        { view: 'about' },
    'GET /datepicker':                   { view: 'datepicker' },
    'GET /api-docs':                   { view: 'api-docs',  locals: { layout: false }},

    'GET /feedback':                    { controller: 'feedback', action: 'form' },
    'POST /feedback/submit':            { controller: 'feedback', action: 'submit' },
    'GET /video-annotation':                { controller: 'video_annotation', action: 'index' },
    'GET /video-annotation/demo':           { controller: 'video_annotation', action: 'demo' },
    'GET /video-annotation/annotate':        { controller: 'video_annotation', action: 'annotate' },
    'POST /video-annotation/submit':         { controller: 'video_annotation', action: 'submit' },

     // SESSION
    'GET /session/new':           { controller: 'session', action: 'new' },
    'POST /session/create':        { controller: 'session', action: 'create' },
    'GET /session/display':       { controller: 'session', action: 'display'},
    'GET /session/destroy':       { controller: 'session', action: 'destroy'},

     // USER
    'GET /user':                    { controller: 'user', action: 'index'},
    'GET /users':                   { controller: 'user', action: 'get'},
    'GET /user/edit':               { controller: 'user', action: 'edit'},
    'GET /user/exportfile':         { controller: 'user', action: 'exportfile'},
    'GET /user/new-user':           { controller: 'user', action: 'newuser'},
    'GET /user/register':           { controller: 'user', action: 'register'},
    'GET /user/settings':           { controller: 'user', action: 'settings'},
    'POST /user/settings':           { controller: 'user', action: 'settingsupdate'},
    'POST /user/signup':            { controller: 'user', action: 'signup'},
    'POST /user/update':           { controller: 'user', action: 'update'},
    'POST /user/block':             { controller: 'user', action: 'block'},
    'POST /user/blocklang':           { controller: 'user', action: 'blocklang'},
    'POST /user/reverse-blocklang':   { controller: 'user', action: 'blocklang-reverse'},
    'POST /user/unblock':            { controller: 'user', action: 'unblock'},
    'POST /user/role':             { controller: 'user', action: 'role'},
    'POST /user/destroy':           { controller: 'user', action: 'destroy'},
    'GET /email/confirm':           { controller: 'user', action: 'confirm-email' },
    'GET /email/confirmed':           { controller: 'user', action: 'confirmed-email' },

    // ORGANISATION
    'GET /organisation':               { controller: 'organisation', action: 'get' },
    'GET /organisation/new':               { controller: 'organisation', action: 'new' },
    'GET /organisation/show':              { controller: 'organisation', action: 'show' },
    'POST /organisation/create':           { controller: 'organisation', action: 'create' },
    'POST /organisation/refreshtoken':      { controller: 'organisation', action: 'refreshtoken' },
    'POST /organisation/update':            { controller: 'organisation', action: 'update' },
    'POST /organisation/api-info':         { controller: 'organisation', action: 'api-info'},

    // LOG
    'GET /log': { controller: 'log', action: 'index'},

    // TASK
    'GET /task/subtitles':            { controller: 'task', action: 'subtitles'},
    'GET /task/work':                 { controller: 'task', action: 'work'},
    'GET /task/list':                { controller: 'task', action: 'list'},
    'POST /task/uploadvideo':        { controller: 'task', action: 'uploadvideo'},
    'POST /task/assign':            { controller: 'task', action: 'assign'},
    'POST /task/unassign':            { controller: 'task', action: 'unassign'},
    'POST /task/refreshtoken':        { controller: 'task', action: 'refreshtoken'},

    // API for other clients
    'GET /api/api-version':      { controller: 'api', action: 'api-version'},
    'GET /api/confirm/subt':      { controller: 'api', action: 'confirm-subt'},
    'GET /api/finished/subt':    { controller: 'api', action: 'finish-subt'},
    'GET /api/cancel/subt':    { controller: 'api', action: 'cancel-subt'},

    'POST /api/available/subt':  { controller: 'api', action: 'available-subt'},
    'POST /api/reject/subt':     { controller: 'api', action: 'reject-subt'},
    'PUT /api/update/subt':      { controller: 'api', action: 'update-subt'},
    'POST /api/log-error':       { controller: 'api', action: 'log-error'},

    'PUT /api/editorstats/subt':        { controller: 'api', action: 'editorstats-subt'},
    'PUT /api/reviewerstats/subt':      { controller: 'api', action: 'reviewerstats-subt'},

    // 'POST /submit-feedback':        { controller: 'feedback', action: 'submit'},

};
