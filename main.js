const utils = require('./modules/get-csv-data.js');
let templateProcess = require('./sample_data/dashboard-template-2.json');

// Set process name
templateProcess.processVersionSets[0].name =
    'Machine Dashboard - ' + new Date();

// Create variables for each item in array (array of asset_ids)
let asset_ids = [
    'FH0895',
    'FH0831',
    'FH1537',
    'FH0829',
    'FH0830',
    'FH0828',
    'FH0722',
    'FH1628',
    'FH1453',
    'FH1454',
    'FH1618',
    'FH1619',
    'FH0897',
    'FH1102',
    'FH0896',
    'FH0825',
    'FH0816',
    'FH0949',
    'FH0817',
    'FH1436',
    'FH0815',
    'FH0823'
];

function createDashboard(template, machines) {
    addActionsToTrigger(template, 'Update', trigger => {
        let processId = template.processVersionSets[0].versions[0].process;
        let columns = 7;
        let column = 0;
        let rows = 4;
        let row = 0;

        // add variable and action for each machine
        machines.forEach(element => {
            console.log(element);
            // add variable for machine
            let machineVariable = buildMachineVariable(element, processId);
            template.variables.push(machineVariable);

            // add trigger action
            let action = buildTriggerAction(element, machineVariable._id);
            trigger.clauses[0].actions.push(action);

            let margin = {
                top: 0.05
            };

            let subField = [
                { name: 'color2', padding: 0 },
                {
                    name: 'name',
                    line: 0,
                    font_color: '#FFF',
                    font_bold: true,
                    horiz_align: 'left',
                    padding: 0.002
                },
                {
                    name: 'asset_id',
                    line: 2
                },
                { name: 'state', line: 3 },
                { name: 'duration', line: 4 }
            ];

            let top = margin.top + (1 / columns) * row;
            let width = 1 / columns;
            let lines = 5;

            subField.forEach(e => {
                let padding = e.padding != undefined ? e.padding : -0.002;
                let horiz_align =
                    e.horiz_align != undefined ? e.horiz_align : 'right';
                // console.log(e.name, width / e.line);
                let widget = {
                    _id: makeid(),
                    left: padding + column / columns,
                    top:
                        e.line != undefined
                            ? top + (width / lines) * e.line
                            : top,
                    type: 'variable_formattable',
                    widget_version_set: makeid(),
                    font_size: 40,
                    width: width,
                    height: width,
                    font_color:
                        e.font_color != undefined ? e.font_color : '#182339',
                    variable: machineVariable._id,
                    subField: [e.name],
                    font_bold: e.font_bold,
                    horiz_align: horiz_align
                };

                template.widgets.push(widget);
                // add widgets to step
                template.steps[0].widgets.push(widget._id);
            });

            if (column == columns - 1) {
                column = 0;
                row++;
            } else {
                column++;
            }
        });
    });

    addActionsToTrigger(template, 'Set blank squares', trigger => {
        // add variable and action for each machine
        machines.forEach(element => {
            // add trigger action
            // let action = buildTriggerAction(element, machineVariable._id);
            // trigger.clauses[0].actions.push(action);
        });
    });

    // save results
    utils.saveJsonFile(
        'test-files/output/complete-process.json',
        templateProcess
    );

    return template;
}

createDashboard(templateProcess, asset_ids);

function addActionsToTrigger(template, description, cb) {
    template.triggers.forEach(e => {
        if (e.description != description) return;

        cb(e);
    });
}

function makeid(length = 17) {
    var text = '';
    var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function buildMachineVariable(assetId, processId) {
    return {
        _id: makeid(),
        process: processId,
        name: assetId,
        type: {
            state: 'string',
            color: 'string',
            start_time: 'string',
            main_program: 'string',
            active_program: 'string',
            comment: 'string',
            duration: 'string',
            utilization: 'string',
            name: 'string',
            color2: 'imageUrl',
            asset_id: 'string'
        },
        persistent: true,
        variable_version_set: makeid()
    };
}

function buildTriggerAction(
    asset_id,
    variableId,
    functionId = '3C8eEbWBGCTgzXX4g'
) {
    return {
        _id: makeid(),
        input_values: [
            {
                datasourceType: 'connector',
                valueType: {
                    isReadable: true,
                    isWritable: false,
                    baseType: 'connectorValue'
                },
                connectorId: 'poNDGgpb3rpctyk3Q',
                functionId: functionId
            },
            {
                datasourceType: 'static',
                valueType: {
                    baseType: 'string',
                    isReadable: true,
                    isWritable: false
                },
                value: asset_id,
                mentionMap: {}
            },
            {
                datasourceType: 'variable',
                variableId: variableId,
                path: [],
                valueType: {
                    baseType: {
                        state: 'string',
                        color: 'string',
                        start_time: 'string',
                        main_program: 'string',
                        active_program: 'string',
                        comment: 'string',
                        duration: 'string',
                        utilization: 'string',
                        name: 'string',
                        color2: 'imageUrl',
                        asset_id: 'string'
                    },
                    isReadable: true,
                    isWritable: true
                }
            }
        ],
        type: 'run_connector_function'
    };
}
