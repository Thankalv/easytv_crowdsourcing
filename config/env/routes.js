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

    'GET /':                                { action: 'homepage' },
    'GET /about':                           { view: 'about' },
    'GET /datepicker':                      { view: 'datepicker' },
    'GET /api-docs':                        { view: 'api-docs',  locals: { layout: false }},

    'GET /feedback':                         { controller: 'feedback', action: 'form' },
    'POST /feedback/submit':                 { controller: 'feedback', action: 'submit' },

    'GET /avatar/motion-clips':               { controller: 'avatar' , action: 'motion-clip' },

     // SESSION
    'GET /session/new':                 { controller: 'session', action: 'new' },
    'POST /session/create':             { controller: 'session', action: 'create' },
    'GET /session/display':             { controller: 'session', action: 'display'},
    'GET /session/destroy':             { controller: 'session', action: 'destroy'},
    // 'GET /session/userdestroy':   { controller: 'session', action: 'userdestroy'},

     // USER
    'GET /users':                   { controller: 'user', action: 'index'},
    'GET /user/list':               { controller: 'user', action: 'get'},
    'GET /user/edit':               { controller: 'user', action: 'edit'},
    'GET /user/confidence-level':   { controller: 'user', action: 'confidence-levels'},
    'GET /user/exportfile':         { controller: 'user', action: 'exportfile'},
    'GET /user/new-user':           { controller: 'user', action: 'newuser'},
    'GET /user/register':           { controller: 'user', action: 'register'},
    'GET /user/settings':           { controller: 'user', action: 'settings'},
    'GET /user/selfdestroy':        { controller: 'user', action: 'selfdestroy'},
    'POST /user/settings':          { controller: 'user', action: 'settingsupdate'},
    'POST /user/signup':            { controller: 'user', action: 'signup'},
    'POST /user/update':            { controller: 'user', action: 'update'},
    'POST /user/subscribe':         { controller: 'user', action: 'task-subscribe'},
    'POST /user/block':             { controller: 'user', action: 'block'},
    'POST /user/blocklang':         { controller: 'user', action: 'blocklang'},
    'POST /user/reverse-blocklang':     { controller: 'user', action: 'blocklang-reverse'},
    'POST /user/unblock':               { controller: 'user', action: 'unblock'},
    'POST /user/role':                  { controller: 'user', action: 'role'},
    'POST /user/destroy':               { controller: 'user', action: 'destroy'},
    'GET /email/confirm':               { controller: 'user', action: 'confirm-email' },
    'GET /email/confirmed':             { controller: 'user', action: 'confirmed-email' },
    'GET /user/confidence-review':      { controller: 'user', action: 'confidence-review' },
    'POST /user/confidence-update':     { controller: 'user', action: 'confidence-update' },
    'POST /user/confidence-change':     { controller: 'user', action: 'confidence-change' },
    'POST /user/primary-lang':          { controller: 'user', action: 'prim-lang' },

    // volunteers workflow
    'GET /volunteer-manager':               { controller: 'volunteer', action: 'manager' },
    'GET /volunteer/testing':               { controller: 'volunteer', action: 'testing' },
    'GET /volunteer/evaluation':            { controller: 'volunteer', action: 'evaluation' },
    'POST /volunteer/allow':                { controller: 'volunteer', action: 'allow' },
    'POST /volunteer/archive':              { controller: 'volunteer', action: 'archive' },
    'GET /volunteer/register-complete':     { controller: 'volunteer', action: 'register' },
    'POST /volunteer/register':             { controller: 'volunteer', action: 'complete-reg' },
    'GET /volunteer/user/confidence-review': { controller: 'user', action: 'confidence-review' },

    // ORGANISATION
    'GET /organisation/list':               { controller: 'organisation', action: 'get' },
    'GET /organisation/new':                { controller: 'organisation', action: 'new' },
    'GET /organisation/show':               { controller: 'organisation', action: 'show' },
    'POST /organisation/create':            { controller: 'organisation', action: 'create' },
    'POST /organisation/refreshtoken':      { controller: 'organisation', action: 'refreshtoken' },
    'POST /organisation/update':            { controller: 'organisation', action: 'update' },
    'POST /organisation/update-emails':     { controller: 'organisation', action: 'update-email' },
    'POST /organisation/api-info':          { controller: 'organisation', action: 'api-info'},
    'DELETE /organisation':                 { controller: 'organisation', action: 'destroy' },

    // LOG
    'GET /log': { controller: 'log', action: 'index'},

    // TASK
    'GET /task/subtitles':              { controller: 'task', action: 'subtitles'},
    'GET /task/work':                   { controller: 'task', action: 'work'},
    'GET /task/list':                   { controller: 'task', action: 'list'},
    'GET /task/duplicount':             { controller: 'task', action: 'duplicount'},
    'POST /task/uploadvideo':           { controller: 'task', action: 'uploadvideo'},
    'POST /task/uploadmocap':           { controller: 'task', action: 'uploadmocap'},
    'POST /task/uploadmocap-extra':     { controller: 'task', action: 'uploadmocapextra'},
    'POST /task/uploadsuggestion':      { controller: 'task', action: 'uploadsuggestion'},
    'POST /task/uploadtranslation':      { controller: 'task', action: 'uploadtranslation'},
    'POST /task/uploadtest':            { controller: 'task', action: 'uploadtest'},
    'POST /task/assign':                { controller: 'task', action: 'assign'},
    'POST /task/unassign':              { controller: 'task', action: 'unassign'},
    'POST /task/refreshtoken':          { controller: 'task', action: 'refreshtoken'},
    'DELETE /task/delete':              { controller: 'task', action: 'destroy'},

    // API for other integration purposes
    'GET /api/api-version':         { controller: 'api', action: 'api-version'},
    'GET /api/confirm/subt':        { controller: 'api', action: 'confirm-subt'},
    'GET /api/finished/subt':       { controller: 'api', action: 'finish-subt'},
    'GET /api/cancel/subt':         { controller: 'api', action: 'cancel-subt'},
    'GET /api/motion/concept':      { controller: 'api', action: 'motion-concept'},

    'POST /api/available/subt':         { controller: 'api', action: 'available-subt'},
    'POST /api/reject/subt':            { controller: 'api', action: 'reject-subt'},
    'POST /api/reset/subt':             { controller: 'api', action: 'reset-subt'},
    'POST /api/log-error':              { controller: 'api', action: 'log-error'},
    'PATCH /api/update/user':           { controller: 'api', action: 'update-user'},
    'PATCH /api/update/org':            { controller: 'api', action: 'update-org'},
    'PUT /api/update/subt':             { controller: 'api', action: 'update-subt'},
    'PUT /api/modify-status/user':      { controller: 'api', action: 'user-modlevel'},

    'PUT /api/editorstats/subt':        { controller: 'api', action: 'statseditor-subt'},
    'PUT /api/reviewerstats/subt':      { controller: 'api', action: 'statsreview-subt'},

    // Video-Annotation methods for the Ontology-Service Integration
    'GET /video-annotation':                        { controller: 'video_annotation', action: 'index' },
    'GET /video-annotation/list':                   { controller: 'video_annotation', action: 'list-annotated' },
    'GET /video-annotation/list-not':               { controller: 'video_annotation', action: 'list-not-annotated' },
    'GET /video-annotation/demo':                   { controller: 'video_annotation', action: 'demo' },
    'GET /video-annotation/search':                 { controller: 'video_annotation', action: 'search' },
    'GET /video-annotation/annotate':               { controller: 'video_annotation', action: 'annotate' },
    'GET /video-annotation/annotate-new':           { controller: 'video_annotation', action: 'add-new-annot' },
    'GET /video-annotation/mocap-new':              { controller: 'video_annotation', action: 'add-new-mocap' },
    'GET /video-annotation/concept-new':            { controller: 'video_annotation', action: 'add-new-concept' },
    'GET /video-annotation/annotate-pair':          { controller: 'video_annotation', action: 'annotate-pair' },
    'GET /video-annotation/pending':                { controller: 'video_annotation', action: 'pending' },
    'GET /video-annotation/create-pending':         { controller: 'video_annotation', action: 'create-pending' },
    'POST /video-annotation/create-pending':        { controller: 'video_annotation', action: 'create-pending' },
    'GET /video-annotation/get-translation':        { controller: 'video_annotation', action: 'get-translation' },
    'GET /video-annotation/new-video':              { controller: 'video_annotation', action: 'new-video' },
    'GET /video-annotation/new-translation':        { controller: 'video_annotation', action: 'new-translation' },
    'GET /video-annotation/new-pair-info':          { controller: 'video_annotation', action: 'new-pair-info' },
    'GET /video-annotation/show-translations':      { controller: 'video_annotation', action: 'show-translations' },
    'GET /video-annotation/show-submissions':       { controller: 'video_annotation', action: 'show-submissions' },
    'GET /video-annotation/submit-evaluation':      { controller: 'video_annotation', action: 'eval-submit' },
    'POST /video-annotation/verify-translation':    { controller: 'video_annotation', action: 'verify-translation' },
    'POST /video-annotation/reject-submission':     { controller: 'video_annotation', action: 'reject-submission' },
    'POST /video-annotation/submit':                { controller: 'video_annotation', action: 'submit' },
    'POST /video-annotation/new-pair':              { controller: 'video_annotation', action: 'new-pair' },
    'POST /video-annotation/submit-translation':    { controller: 'video_annotation', action: 'submit-translation' },
    'POST /video-annotation/submit-pair':           { controller: 'video_annotation', action: 'submit-pair' },
    'POST /video-annotation/verify-submission':     { controller: 'video_annotation', action: 'score-submission' },
    'GET /video-annotation/show-mocap':             { controller: 'avatar', action: 'motion-clip' },
};
