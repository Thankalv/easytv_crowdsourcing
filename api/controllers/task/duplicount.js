
module.exports = {

    friendlyName: "Count tasks with duplicated job_ids",
  
    description:  "API DELETE request, only allowed to admin",
  
    inputs: {

    },
    exits: {
        success: {
          statusCode : 200,
          description: "Duplicated tasks were returned!"
        },
        notFound: {
          statusCode : 500,
          description: "Some server-side error occured!"
        }
      },



    fn: async function (inputs, exits) 
    {
        var tasksFound = await Task.find();
        var jobIDs = await tasksFound.map( ajob => { return ajob.job_id});
        var dupls = await UtilService.findDuplicates(jobIDs);

        return exits.success({ duplicates: dupls });
    }
};
