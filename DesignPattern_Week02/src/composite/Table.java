package composite;

import java.util.List;

public class Table implements Item {

    private List<Product> products;

    public Table(List<Product> products) {
        this.products = products;
    }

    @Override
    public double getPrice() {
        double price = 0;
        for (Product product : products) {
            price += product.getPrice();
        }
        return price;
    }
}
