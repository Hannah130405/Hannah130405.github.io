CategoryColour = 0;
Blockly.Blocks['text'] = {
  colour: CategoryColour,
  oldInit: Blockly.Blocks['text'].init,
  init: function() {
    this.oldInit();
    this.setColour(this.colour);
  }
}
Blockly.Blocks['logic_boolean'] = {
  colour: CategoryColour,
  oldInit: Blockly.Blocks['logic_boolean'].init,
  init: function() {
    this.oldInit();
    this.setColour(this.colour);
  }
};
Blockly.Blocks['controls_for'] = {
  colour: CategoryColour,
  oldInit: Blockly.Blocks['controls_for'].init,
  init: function() {
    this.oldInit();
    this.setColour(this.colour);
  }
};
Blockly.Blocks['math_number'] = {
  colour: CategoryColour,
  oldInit: Blockly.Blocks['math_number'].init,
  init: function() {
    this.oldInit();
    this.setColour(this.colour);
  }
};
Blockly.Blocks['variables_get'] = {
  colour: CategoryColour,
  oldInit: Blockly.Blocks['variables_get'].init,
  init: function() {
    this.oldInit();
    this.setColour(this.colour);
  }
};
Blockly.Blocks['variables_set_global'] = {
  colour: CategoryColour,
  oldInit: Blockly.Blocks['variables_set'].init,
  init: function() {
    this.appendDummyInput()
        .appendField("global");
    this.oldInit();
    this.setColour(this.colour);
  }
};
Blockly.Lua['variables_set_global'] = Blockly.Lua['variables_set'];

Blockly.Blocks['variables_set_local'] = {
  colour: CategoryColour,
  oldInit: Blockly.Blocks['variables_set'].init,
  init: function() {
    this.appendDummyInput()
        .appendField("local");
    this.oldInit();
    this.setColour(this.colour);
  }
};
Blockly.Lua['variables_set_local'] = function(block) {
  return "local " + Blockly.Lua['variables_set'](block);
};

BlocklyToolbox.contents[BlocklyToolbox.contents.length] = {
  "kind": "category",
  "name": "Default",
  "colour": ""+CategoryColour,
  "contents": [
    {
      "kind": "block",
      "type": "text",
    },
    {
      "kind": "block",
      "type": "logic_boolean",
    },
    {
      "kind": "block",
      "type": "math_number",
    },
    {
      "kind": "block",
      "type": "variables_set_local",
    },
    {
      "kind": "block",
      "type": "variables_set_global",
    },
    {
      "kind": "block",
      "type": "variables_get",
    },
    {
      "kind": "block",
      "type": "controls_for",
      "inputs": {
        "FROM": {
          "shadow": {
            "type": "math_number",
            "fields": {
              "NUM": 1
            }
          }
        },
        "TO": {
          "shadow": {
            "type": "math_number",
            "fields": {
              "NUM": 10
            }
          }
        },
        "BY": {
          "shadow": {
            "type": "math_number",
            "fields": {
              "NUM": 1
            }
          }
        },
      }
    },
  ]
};