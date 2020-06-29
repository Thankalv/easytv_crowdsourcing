
module.exports = {

    friendlyName: 'Prepare the member-register page',
    description: "Each organisation has its own 'register parameters', render accordingly",
    inputs: {
        user: {
            description: 'The userId of the user completing the register',
            required: true,
            type: 'string',
        },
        org: {
            description: 'The orgid to which the user belongs',
            required: true,
            type: 'string',
        },
        token: {
            description: 'the email access-token',
            required: true,
            type: 'string',
        },
        lang: {
            description: 'the language under testing',
            required: true,
            type: 'string',
        }
    },
    exits: {
        success: {
          statusCode: 200,
          description: 'render the user/register page.',
          viewTemplatePath: 'volunteer/complete-reg'
        },
    },
    fn: async function (inputs, exits)
    {
        var orgId = inputs.org;
        var organisation = await Organisation.findOne(orgId).intercept((err)=>{  return this.res.notFound(); });
        if (!organisation) {
            FlashService.warn(this.req, "the organisation seems to be deleted or inactive");
            return this.res.redirect("/");
        }
        else{
            var userId = inputs.user;
            var user = await User.findOne(userId);

            if(user.registStatus!="pending"){
                FlashService.success(this.req, "You have already submitted this info! Please login");
                return this.res.redirect("/session/new");
            }
            else if(user.reg2_token!=inputs.token){
                FlashService.warn(this.req, "something is wrong with your registration access-token");
                return this.res.redirect("/");
            }
            else{
                return exits.success({
                    org: organisation,
                    user: user,
                    lang: inputs.lang
                });
            }
        }
    }  
};
  