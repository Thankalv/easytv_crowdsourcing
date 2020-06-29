/**
 * Custom configuration
 * (sails.config.oldorgs)
 * *
 * For more information on custom configuration, visit:
 * https://sailsjs.com/config/custom
 */

module.exports.oldorgs = {

    /***************************************************************************
    *                                                                          *
    * JSON object to create previously existing records in MongoDB    *
    *                                                                          *
    ***************************************************************************/
   orgs: [
    { 
      editor2Assign: null,
      reviewer2Assign: null,
      createdAt: 1573647789816,
      updatedAt: 1573827356354,
      id: '5dcbf5adbf8ca0500fd2c495',
      name: 'Default',
      description: 'Default Organisation',
      consent_form: '',
      consent_required: false,
      warrant: false,
      personal_code: false,
      token: '',
      token_required: false,
      en1: 'Thank you for your registration, you are currently in the volunteers’ pre-selection queue.',
      en2: 'You\'re now pre-selected. You will be required to take a testing phase',
      en25: 'You\'have completed a testing session. Your submission is pending to be evaluated.',
      en3: 'You have successfully passed the validation test and now you can complete the registration process',
      en4: 'You have sucessfully completed the second part of registration and you will soon be able to access Broadcaster\'s content',
      api_info:
       { headerName: 'NOT_EXIST',
         headerToken: 'NOT_EXIST',
         getJobsURL: 'NOT_EXIST',
         postUserJob: 'NOT_EXIST' },
      lang_info: null,
      blocked: { users: [] },
    },
    { 
      editor2Assign: null,
      reviewer2Assign: null,
      createdAt: 1573742344560,
      updatedAt: 1573742344560,
      id: '5dcbf93b7c213e3a1542e170',
      name: 'Sign Language User',
      description: '<p>this is where the Sign-Language members are registered</p>',
      consent_form: '',
      consent_required: false,
      warrant: false,
      personal_code: false,
      token: '',
      token_required: false,
      en1: 'Thank you for your registration, you are currently in the volunteers’ pre-selection queue.',
      en2: 'You\'re now pre-selected. You will be required to take a testing phase',
      en25: 'You\'have completed a testing session. Your submission is pending to be evaluated.',
      en3: 'You have successfully passed the validation test and now you can complete the registration process',
      en4: 'You have sucessfully completed the second part of registration and you will soon be able to access Broadcaster\'s content',
      api_info: null,
      lang_info: null,
      blocked: { users: [] },
    },
    { 
      editor2Assign: null,
      reviewer2Assign: null,
      createdAt: 1573742344560,
      updatedAt: 1574691343703,
      id: '5dcbfa427c213e3a1542e1bb',
      name: 'CCMA',
      description: '<p>testing organisation for the "CCMA volunteer workflow"</p>',
      consent_form: '',
      consent_required: false,
      warrant: false,
      personal_code: false,
      token: 'CCMA',
      token_required: false,
      en1: 'Thank you for your registration, you are currently in the volunteers’ pre-selection queue.',
      en2: 'You\'re now pre-selected. You will be required to take a testing phase',
      en25: 'You\'have completed a testing session. Your submission is pending to be evaluated.',
      en3: 'You have successfully passed the validation test and now you can complete the registration process',
      en4: 'You are ready to access Broadcaster\'s content of <b>archive level</b>',
      api_info:
       { getJobsURL: 'https://spm-api.easytv.eng.it/api/Jobs?excludefields=ExcludeAllSubtitleFields',
         postUserJob: 'https://spm-api.easytv.eng.it/api/Credentials',
         headerName: 'X-EasyTV-Key',
         headerToken: 'dea005f1143a6626be48e2d4878ecf8538a5dde78996fb673c9663bcb1be5390' },
      lang_info: null,
      blocked: { users: [] },
    }
   ]
};