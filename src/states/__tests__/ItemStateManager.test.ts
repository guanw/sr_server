import itemsStateManager from "../ItemStateManager";

describe('add', () => {
  it('addItem should create new item', () => {
    itemsStateManager.addItem();
    const itemKeys = Object.keys(itemsStateManager.getItems());
    expect(itemKeys.length).toBe(1);
  });

  it('serialize should return x,y of item', () => {
    const serializedStates = itemsStateManager.serialize();
    const itemKeys = Object.keys(serializedStates);
    expect(itemKeys.length).toBe(1);
    const serializedItem = serializedStates[itemKeys[0]];
    expect(serializedItem).toHaveProperty("x");
    expect(serializedItem).toHaveProperty("y");
  })

  it('consumeItem should remove item', () => {
    const oldItemKeys = Object.keys(itemsStateManager.getItems());
    expect(oldItemKeys.length).toBe(1);
    itemsStateManager.consumeItem(oldItemKeys[0]);
    const UpdatedItemKeys = Object.keys(itemsStateManager.getItems());
    expect(UpdatedItemKeys.length).toBe(0);
  })
});