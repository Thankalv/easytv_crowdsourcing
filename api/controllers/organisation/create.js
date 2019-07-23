
module.exports = {

    friendlyName: 'Register a new organisation in the platform',
  
    description: 'Register a new organisation in the platform',
  
    inputs: {
  
        name: {
            type: 'string',
            required: true,
            description: "The org's official name"
        },
        description: {
            type: 'string',
            description: "a description paragraph"
        }
    },

    exits: {

        success: {
          description: 'A new organisation was registered successfully in CP'
        },
    
        invalid: {
          responseType: 'badRequest',
          description: 'There was an internal error while processing the request.'
        },

        NameAlreadyExists: {
            statusCode: 409,
            description: 'The provided organisation name is already in use.',
        },
        
        errorInAttributes: {
            statusCode: 409,
            description: 'Missing value for required attribute.',
          },

      },

    fn: async function (inputs, exits) 
    {
        //sails.log(inputs)
        var existingOrg = await Organisation.findOne( {name: inputs.name});

        if (existingOrg)
            return exits.NameAlreadyExists({code:-8, description: 'The provided organisation name already exists.'})

        var newOrg = await Organisation.create(inputs)
            .intercept('E_INVALID_NEW_RECORD',  (err)=>{  FlashService.success(this.req, err.details);; return this.res.redirect('/'); })
            .fetch();

        //sails.log(inputs.values);
        sails.log(newOrg);
        
        if(newOrg)
        {
            FlashService.success(this.req, 'Created new Organisation!');
            return this.res.redirect('/');
        }
        else
            throw "invalid";
    }
  
  
  };
  