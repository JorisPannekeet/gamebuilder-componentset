(() => ({
  name: 'Platform',
  icon: 'RowColumnIcon',
  category: 'LAYOUT',
  keywords: ['Layout', 'column', 'columns', '1'],
  structure: [
    {
      name: 'Platform',
      options: [
        {
          value: '100',
          label: 'Width',
          key: 'width',
          type: 'NUMBER',
        },
        {
          value: '15',
          label: 'Height',
          key: 'height',
          type: 'NUMBER',
        },
        {
          type: 'CUSTOM',
          label: 'Fill style',
          key: 'fillstyle',
          value: 'texture',
          configuration: {
            as: 'BUTTONGROUP',
            dataType: 'string',
            allowedInput: [
              { name: 'Color', value: 'color' },
              { name: 'Texture', value: 'texture' },
            ],
          },
        },
        {
          value:
            'https://assets.bettyblocks.com/0428e33459124f1fbf8d99bd3ce31386_assets/files/platform',
          label: 'Texture',
          key: 'texture',
          type: 'TEXT',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'fillstyle',
              comparator: 'EQ',
              value: 'texture',
            },
          },
        },
        {
          value: 'Primary',
          label: 'Color',
          key: 'color',
          type: 'COLOR',
          configuration: {
            condition: {
              type: 'SHOW',
              option: 'fillstyle',
              comparator: 'EQ',
              value: 'color',
            },
          },
        },
      ],
      descendants: [],
    },
  ],
}))();
