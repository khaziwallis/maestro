/**
 * HomeController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */
 var async = require('async');

module.exports = {
    
  


  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to HomeController)
   */
  _config: {},
  index: function(req, res){
    var blueprint_utils = require('blueprint/blueprint');
    blueprint_utils.get_blueprint_id(function(err){
      console.log('Unable to get the instance_id of the kit: '+err.message);
      res.view('500', { errors: [ 'Unable to get the instance_id of the kit: '+err.message ]});
    }, function(result){
      if(res === undefined){
        res.view('500', { errors: [ 'Unable to get the instance_id of the kit: '+err.message ]});
      }else{
        result = JSON.parse(result);
        if(result instanceof Error){
          res.view('500', { errors: [ 'Unable to get the instance_id of the kit: '+err.message ]});
        }else{
          var tools = [];
          var defect_tracker = [];
          
          async.series({
              tools: function(callback){
                blueprint_utils.get_blueprint_section(result.id, 'tools', function(err){
                  //Suppress the error and log the exception
                  console.log('Unable to retrieve the tools:'+err.message);
                  callback();
                }, function(res_tools){
                  tools = JSON.parse(res_tools);
                  callback(null, tools);
                })
              },
              defect_tracker: function(callback){
                blueprint_utils.get_blueprint_section(result.id, 'defect_tracker', function(err){
                  //Suppress the error and log the exception
                  console.log('Unable to retrieve the defect_tracker:'+err.message);
                  callback();
                }, function(res_dt){
                  defect_tracker = JSON.parse(res_dt);
                  callback(null, defect_tracker);
                })
              }
          }, function(errasync, results) {
              if (errasync) {
                console.log('Error getting the tools and defect tracker: '+errasync.message)
                res.view('500', { errors: [ errasync.message ]});
              }else{
                res.view(results, 200);
              }
          });
          
        }
        
      }
    });
  },
  statics: function(req, res){
    //TODO: integrate nagios
    var service = req.param('service');
    var backups = require('backup/backup').get_backup_data();
    var has_backups = true;
    if(!backups[service]){
        has_backups = false;
    }
    res.view({ layout: null, backup_service: service, has_backups: has_backups });
  },
  tutorial: function(req, res){
    res.view({ layout: null });
  },
  projects: function(req, res){
    res.view({ layout: null });
  }
};
