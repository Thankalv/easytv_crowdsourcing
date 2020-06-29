
module.exports = {

    friendlyName: 'Check the user registration complete',
    description: "Each organisation has its own 'register requirement', handle users accordingly",
    inputs: {
        userid:{
            description: 'The userid the user completing the register',
            required: true,
            type: 'string',
        },
        firstName: {
            description: 'The real first-name of the user completing the register',
            required: true,
            type: 'string',
        },
        lastName1: {
            description: 'The real first-Surname of the user completing the register',
            required: true,
            type: 'string',
        },
        lastName2:{
            description: 'The real second-Surname of the user completing the register',
            required: true,
            type: 'string',
        },
        idpassport:{
            description: 'The official ID/passport of the user',
            required: true,
            type: 'string',
        },
        agree:{
            description: "Confidentiality agreement",
            required: true,
            type: "string"
        },
        lang:{
            description: "The language under testing",
            required: true,
            type: "string"
        }
    },

    fn: async function (inputs)
    {
        var regComplete = {
            idpassport : inputs.idpassport,
            lastName2 : inputs.lastName2,
            conf_agree : "I agree",
        }

        var updUser = await User.updateOne(inputs.userid).set({ registStatus: 'submitted', regComplete: regComplete });
        updUser.userOrganisation = await Organisation.findOne(updUser.userOrganisation);
        //sails.log(updUser);
        await ENService.sendEN(updUser, 4, inputs.lang);
        return this.res.redirect("/session/new");
    }  
};
  