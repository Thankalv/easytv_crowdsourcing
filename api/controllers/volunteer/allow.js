module.exports = {

    friendlyName: 'A user proceed to testing phase',

    inputs:{
        id: {
            type: 'string',
            description: 'The id of the organisation'
        },
        user: {
            type: 'string',
            description: 'The id of the user to alow'
        },
        lang: {
            description: "the language code to block",
            type: 'string',
          },
    },
    exits:{
        success: {
          statusCode: 200,
          description: 'upgrade user level'
        },
        notFound: {
            statusCode : 404,
            description: "The requested user was not found"
        },
    },

    fn: async function (inputs, exits)
    {
        sails.log(inputs.user);
        // update the user's role in the database
        var user2allow = await User.findOne(inputs.user);
        if(!user2allow) return exits.notFound();

        // allow this user to access/interact with testing-content
        user2allow.lang_info = await VoluntService.allowTesting(user2allow, inputs.lang);

        var updUser = await User.updateOne(inputs.user).set(user2allow)
                                   .intercept( ()=>{ return exits.notFound();});

        updUser.userOrganisation = this.req.session.User.userOrganisation;

        await ENService.sendEN(updUser, 2, inputs.lang);

        return exits.success();
    }
};
