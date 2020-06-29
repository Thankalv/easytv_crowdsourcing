module.exports = {

    friendlyName: 'Submit a user feedback comment',
    description: 'Submit a user feedback comment/forward it as email to the Admins',
  
    inputs: {
  
        theme: {
            type: 'string',
            required: true,
            description: "The comment's theme"
        },
        comment: {
            type: 'string',
            description: "A descriptive comment"
        }
    },

    fn: async function (inputs, exits) 
    {
        inputs.user = this.req.session.User.id;
        var newComment = await Feedback.create(inputs)
            .intercept( (err)=>{  
                FlashService.success(this.req, err.details); 
                return this.res.redirect('/'); 
            }).fetch();

        newComment.user = await User.findOne(newComment.user);
        await UserService.forwardFeedback(newComment, this.req.session.User.userOrganisation);
        //sails.log(newComment);
        FlashService.success(this.req, 'Thank you for your comment!');
        return this.res.redirect('/')
    }
}