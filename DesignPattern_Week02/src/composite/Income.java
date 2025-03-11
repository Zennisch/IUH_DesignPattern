package composite;

import java.util.List;

public class Income {

    private final List<Item> items;

    public Income(List<Item> items) {
        this.items = items;
    }

    public double calculateIncome() {
        double income = 0;
        for (Item item : items) {
            income += item.getPrice();
        }
        return income;
    }

}
