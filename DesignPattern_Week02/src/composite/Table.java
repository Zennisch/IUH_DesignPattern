package composite;

import java.util.List;

public class Table implements Item {

    private final List<Item> items;

    public Table(List<Item> items) {
        this.items = items;
    }

    @Override
    public double getPrice() {
        double price = 0;
        for (Item item : items) {
            price += item.getPrice();
        }
        return price;
    }
}
