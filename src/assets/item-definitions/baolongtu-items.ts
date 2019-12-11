import { ItemDefinition } from 'src/model/item-definition'

export const ItemTypes = {
    GemHorizontal: 0,
    GemVertical: 1,
    MogurenEnemy: 2
}

export const ItemDimensions = {
    GemSpacingH: 20,
    GemSpacingV: 16,
    GemWidth: 16,
    GemHeight: 12,
    MogurenWidth: 32,
    MogurenHeight: 40
}

export const Gems: ItemDefinition[] = [
    {
        type: ItemTypes.GemHorizontal,
        label: 'Single Gem',
        defaultState: 1,
        width: ItemDimensions.GemWidth,
        height: ItemDimensions.GemHeight
    },

    {
        type: ItemTypes.GemHorizontal,
        label: '2 Gems - Horizontal',
        defaultState: 0b11000000,
        width: ItemDimensions.GemWidth + ItemDimensions.GemSpacingH * 1,
        height: ItemDimensions.GemHeight
    },

    {
        type: ItemTypes.GemHorizontal,
        label: '3 Gems - Horizontal',
        defaultState: 0b11100000,
        width: ItemDimensions.GemWidth + ItemDimensions.GemSpacingH * 2,
        height: ItemDimensions.GemHeight
    },

    {
        type: ItemTypes.GemHorizontal,
        label: '4 Gems - Horizontal',
        defaultState: 0b11110000,
        width: ItemDimensions.GemWidth + ItemDimensions.GemSpacingH * 3,
        height: ItemDimensions.GemHeight
    },

    {
        type: ItemTypes.GemHorizontal,
        label: '5 Gems - Horizontal',
        defaultState: 0b11111000,
        width: ItemDimensions.GemWidth + ItemDimensions.GemSpacingH * 4,
        height: ItemDimensions.GemHeight
    },

    {
        type: ItemTypes.GemHorizontal,
        label: '6 Gems - Horizontal',
        defaultState: 0b11111100,
        width: ItemDimensions.GemWidth + ItemDimensions.GemSpacingH * 5,
        height: ItemDimensions.GemHeight
    },

    {
        type: ItemTypes.GemHorizontal,
        label: '7 Gems - Horizontal',
        defaultState: 0b11111110,
        width: ItemDimensions.GemWidth + ItemDimensions.GemSpacingH * 6,
        height: ItemDimensions.GemHeight
    },

    {
        type: ItemTypes.GemHorizontal,
        label: '8 Gems - Horizontal',
        defaultState: 0xFF,
        width: ItemDimensions.GemWidth + ItemDimensions.GemSpacingH * 7,
        height: ItemDimensions.GemHeight
    },

    {
        type: ItemTypes.GemVertical,
        label: '2 Gems - Vertical',
        defaultState: 0b11000000,
        width: ItemDimensions.GemWidth,
        height: ItemDimensions.GemHeight + ItemDimensions.GemSpacingV * 1
    },

    {
        type: ItemTypes.GemVertical,
        label: '3 Gems - Vertical',
        defaultState: 0b11100000,
        width: ItemDimensions.GemWidth,
        height: ItemDimensions.GemHeight + ItemDimensions.GemSpacingV * 2
    },

    {
        type: ItemTypes.GemVertical,
        label: '4 Gems - Vertical',
        defaultState: 0b11110000,
        width: ItemDimensions.GemWidth,
        height: ItemDimensions.GemHeight + ItemDimensions.GemSpacingV * 3
    },

    {
        type: ItemTypes.GemVertical,
        label: '5 Gems - Vertical',
        defaultState: 0b11111000,
        width: ItemDimensions.GemWidth,
        height: ItemDimensions.GemHeight + ItemDimensions.GemSpacingV * 4
    },

    {
        type: ItemTypes.GemVertical,
        label: '6 Gems - Vertical',
        defaultState: 0b11111100,
        width: ItemDimensions.GemWidth,
        height: ItemDimensions.GemHeight + ItemDimensions.GemSpacingV * 5
    },

    {
        type: ItemTypes.GemVertical,
        label: '7 Gems - Vertical',
        defaultState: 0b11111110,
        width: ItemDimensions.GemWidth,
        height: ItemDimensions.GemHeight + ItemDimensions.GemSpacingV * 6
    },

    {
        type: ItemTypes.GemVertical,
        label: '8 Gems - Vertical',
        defaultState: 0xFF,
        width: ItemDimensions.GemWidth,
        height: ItemDimensions.GemHeight + ItemDimensions.GemSpacingV * 7
    }
];

export const Enemies = [
    {
        type: ItemTypes.MogurenEnemy,
        label: 'Moguren - Mushroom Man',
        defaultState: 6,
        width: ItemDimensions.MogurenWidth,
        height: ItemDimensions.MogurenHeight
    }
];

export const Items = [].concat(Gems,Enemies);