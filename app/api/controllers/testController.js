
module.exports = {
    
//TODO query needs to be run based on USERID - STARTTIME - ENDTIME (at least)
    
/**
 * Queries the activity tables. At the moment, it performs a SELECT *
 * TODO run queries with parameters
 */
getActivitiesTimeSeries: function (req, res) {
    const pg = require('pg');
    const results = [];
    
    //todo DB ip address must be set in configuration file
    const client = new pg.Client({
                                 user: 'hostview',
                                 host: 'postgres',
                                 database: 'hostview',
                                 password: 'h0stvi3w',
                                 port: 5432
                                 });
    
    client.connect((err) => {
                   if (err) {
                   console.error('connection error', err.stack);
                   } else {
                   console.log('connected');
                   console.log("runTest after connect" );
                   
                   
                   //just debug
                   var queryStr = "select session_id, date_trunc('second', logged_at) as start, date_trunc('second', finished_at) as end, (finished_at-logged_at) as duration, name\
                   from activities\
                   where idle!=1 and logged_at > '2017-03-15 15:38:08.208'\
                   order by 2,3;"
                   
                   /*
                   "    select session_id, date_trunc('second', logged_at) as start, date_trunc('second', finished_at) as end, (finished_at-logged_at) as duration, name\
                   from activities\
                   where idle!=1\
                   order by 2,3;"*/
                   
                   client.query(queryStr, (err, result) => {
                                if (err) {
                                console.log(err.stack);
                                } else {
                                console.log("Result " + result.rows[0]);
                                if(result.rows.length>0){
                                console.log("Result " + result.rows.length);
                                for(var i =0; i<result.rows.length; i++){
                                results.push(result.rows[i]);
                                }
                                }
                                }
                                console.log("runTest we are done");
                                return res.json(results);
                                
                                });
                   
                   }
                   });
    
},
    
getSessionsTimeSeries: function (req, res) {
    const pg = require('pg');
    const results = [];
    
    //todo DB ip address must be set in configuration file
    const client = new pg.Client({
                                 user: 'hostview',
                                 host: 'postgres',
                                 database: 'hostview',
                                 password: 'h0stvi3w',
                                 port: 5432
                                 });
    
    client.connect((err) => {
                   if (err) {
                   console.error('connection error', err.stack);
                   } else {
                   console.log('connected');
                   console.log("runTest after connect" );
                   
                   //just debug
                   var queryStr = "select id as Session, started_at as start, ended_at as end from sessions where (stop_event like 'stop' or stop_event like 'pause' or stop_event like 'suspend') and started_at > '2017-03-15 15:38:08.208' order by 2,3;"
                   /*
                   "select id as Session, started_at as start, ended_at as end\
                   from sessions\
                   where stop_event like 'stop' or stop_event like 'pause' or stop_event like 'suspend'\
                   order by 2,3;"
                   */
                   
                
                   client.query(queryStr, (err, result) => {
                                if (err) {
                                console.log(err.stack);
                                } else {
                                console.log("Result " + result.rows[0]);
                                    if(result.rows.length>0){
                                        console.log("Result " + result.rows.length);
                                        for(var i =0; i<result.rows.length; i++){
                                            results.push(result.rows[i]);
                                        }
                                    }
                                }
                                console.log("runTest we are done");
                                return res.json(results);

                                });
                   
                   }
                   });
    
},
    
getApplicationTimeSeries: function (req, res) {
    const pg = require('pg');
    const results = [];
    
    //todo DB ip address must be set in configuration file
    const client = new pg.Client({
                                 user: 'hostview',
                                 host: 'postgres',
                                 database: 'hostview',
                                 password: 'h0stvi3w',
                                 port: 5432
                                 });
    
    client.connect((err) => {
                   if (err) {
                   console.error('connection error', err.stack);
                   } else {
                   console.log('connected');
                   console.log("runTest after connect" );
                   
                   var queryStr = "select CASE\
                   WHEN (a.description='') THEN lower(a.name)\
                   ELSE lower(a.description )\
                   END as name, date_trunc('second', a.logged_at) as time, EXTRACT(EPOCH FROM SUM(a.finished_at-a.logged_at)) as value\
                   from activities a\
                   WHERE a.idle!=1\
                   AND a.pid!=0\
                   group by 1,2\
                   order by 2;";
                   
                   client.query(queryStr, (err, result) => {
                                if (err) {
                                console.log(err.stack);
                                } else {
                                console.log("Result " + result.rows[0]);
                                if(result.rows.length>0){
                                console.log("Result " + result.rows.length);
                                for(var i =0; i<result.rows.length; i++){
                                results.push(result.rows[i]);
                                }
                                }
                                }
                                console.log("runTest we are done");
                                return res.json(results);
                                
                                });
                   
                   }
                   });
    
},
    
    
getNetworkTimeSeries: function (req, res) {
    const pg = require('pg');
    const results = [];
    
    //todo DB ip address must be set in configuration file
    const client = new pg.Client({
                                 user: 'hostview',
                                 host: 'postgres',
                                 database: 'hostview',
                                 password: 'h0stvi3w',
                                 port: 5432
                                 });
    
    client.connect((err) => {
                   if (err) {
                   console.error('connection error', err.stack);
                   } else {
                   console.log('connected');
                   console.log("runTest after connect" );
                   
                   var queryStr = "select lower(c.ssid) as network, c.started_at as time1, c.ended_at as time2, EXTRACT(EPOCH FROM SUM(c.ended_at-c.started_at)) as value\
                   from connections c\
                   WHERE c.ssid!=''\
                   group by 1,2,3\
                   order by 2,3;";
                   
                   /*var queryStr = "select lower(c.ssid) as network, c.started_at as time1, c.ended_at as time2, EXTRACT(EPOCH FROM SUM(c.ended_at-c.started_at)) as value\
                   from connections c\
                   WHERE c.ssid!=''\
                   AND c.friendly_name LIKE 'Wirelessx Network%'\
                   group by 1,2,3\
                   order by 2,3;";*/
                   
                   client.query(queryStr, (err, result) => {
                                if (err) {
                                console.log(err.stack);
                                } else {
                                console.log("Result " + result.rows[0]);
                                if(result.rows.length>0){
                                console.log("Result " + result.rows.length);
                                for(var i =0; i<result.rows.length; i++){
                                results.push(result.rows[i]);
                                }
                                }
                                }
                                console.log("runTest we are done");
                                return res.json(results);
                                
                                });
                   
                   }
                   });
    
},
    
runTest01: function (req, res) {
    const pg = require('pg');
    console.log("Test runTest" );
    //var connectionString = "postgres://userName:password@serverName/ip:port/nameOfDatabase";
    const connectionString = "postgresql://hostview:h0stvi3w@localhost:5432/hostview";
    const connectionStringA =  "postgresql://hostview:h0stvi3w@localhost/hostview";
    // PROCESS_DB=postgres://hostview:h0stvi3w@postgres/hostview
    
    //const pgClient = new pg.Client(connectionString);
    //conn = psycopg2.connect(dbname='hostview', user='hostview', host='localhost', password='h0stvi3w')
    
    const results = [];
    
    //todo DB ip address must be set in configuration file
    const client = new pg.Client({
                                 user: 'hostview',
                                 host: 'postgres',
                                 database: 'hostview',
                                 password: 'h0stvi3w',
                                 port: 5432
                                 });
    
    //client.connect();
    client.connect((err) => {
                   if (err) {
                   console.error('connection error', err.stack);
                   } else {
                   console.log('connected');
                   console.log("runTest after connect" );
                   
                   
                   client.query("SELECT * FROM test", (err, result) => {
                                if (err) {
                                console.log(err.stack);
                                } else {
                                console.log("Result " + result.rows[0]);
                                if(result.rows.length>0){
                                console.log("Result " + result.rows.length);
                                results.push(result.rows[0]);
                                }
                                }
                                console.log("runTest we are done");
                                return res.json(results);
                                });
                   
                   }
                   });
},
    
runTest02: function (req, res) {
    const pg = require('pg');
    const results = [];
    
    //todo DB ip address must be set in configuration file
    const client = new pg.Client({
                                 user: 'hostview',
                                 host: 'postgres',
                                 database: 'hostview',
                                 password: 'h0stvi3w',
                                 port: 5432
                                 });
    
    client.connect((err) => {
                   if (err) {
                   console.error('connection error', err.stack);
                   } else {
                   console.log('connected');
                   console.log("runTest02 after connect" );
                   
                   var queryStr = "select array_to_json(array_agg(row_to_json(d)))\
                   from (\
                         select session_id, date_trunc('second', logged_at) as start, date_trunc('second', finished_at) as end,\ (finished_at-logged_at) as duration, name\
                         from activities\
                         where idle!=1\
                         order by 2,3\
                         ) d\
                   LIMIT 1;"
                   
                   client.query(queryStr, (err, result) => {
                                if (err) {
                                console.log(err.stack);
                                } else {
                                console.log("Result " + result.rows[0]);
                                if(result.rows.length>0){
                                console.log("Result " + result.rows.length);
                                res.push(result.rows);
                                }
                                }
                                console.log("runTest we are done");
                                return res;
//                                return res.json(results);
                                });
                   
                   }
                   });
    
}
    
}

/*
 client = new pg.Client({
 connectionString: connectionStringA,
 });
 client.connect();
 console.log("runTest after connect connectionStringA" );
 
 
 client.query('SELECT * FROM test', (err, result) => {
 if (err) {
 console.log("ERRRR");
 
 console.log(err.stack);
 } else {
 console.log("Result " + result.length);
 if(result.length>0)
 console.log("Result " + result.length);
 results.push(result);
 }
 });
 
 console.log("runTest we are done");
 
 
 */

/* const client = new pg.Client(connectionString);
 //client.connect();
 const query = client.query('SELECT * FROM test;');
 
 await client.connect();
 
 var result = await client.query("SELECT * FROM test");
 result.rows.forEach(row=>{
 console.log(row);
 results.push(row);
 
 });
 await client.end();
 */

// Get a Postgres client from the connection pool
/*pg.connect(connectionString, (err, client, done) => {
 // Handle connection errors
 if(err) {
 done();
 console.log(err);
 return res.status(500).json({success: false, data: err});
 }
 // SQL Query > Select Data
 const query = client.query('SELECT * FROM test;');
 // Stream results back one row at a time
 query.on('row', (row) => {
 results.push(row);
 });
 // After all data is returned, close connection and return results
 query.on('end', () => {
 done();
 console.log(res.json(results));
 return res.json(results);
 });
 });*/

/*
 function connectToDB() {
 //TODO
 var pg = require('pg');
 var pgClient = new pg.Client(connectionString);
 
 const results = [];
 var connectionString = "postgres://hostview@hostlocalhostview:5432/hostview2016";
 
 // Get a Postgres client from the connection pool
 pgClient.connect(connectionString, (err, client, done) => {
 // Handle connection errors
 if(err) {
 done();
 console.log(err);
 return res.status(500).json({success: false, data: err});
 }
 // SQL Query > Select Data
 const query = client.query('SELECT * FROM test;');
 // Stream results back one row at a time
 query.on('row', (row) => {
 results.push(row);
 });
 // After all data is returned, close connection and return results
 query.on('end', () => {
 done();
 console.log(res.json(results));
 return res.json(results);
 });
 });
 }*/

