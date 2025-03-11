package composite;

import java.util.List;

public class Main {

    public static void main(String[] args) {
        Product product1 = new Product("Tea", 1.0);
        Product product2 = new Product("Coffee", 2.0);
        Product product3 = new Product("Cake", 3.0);
        Product product4 = new Product("Sandwich", 4.0);
        Product product5 = new Product("Salad", 5.0);
        Product product6 = new Product("Soup", 6.0);
        Product product7 = new Product("Burger", 7.0);
        Product product8 = new Product("Pizza", 8.0);
        Product product9 = new Product("Pasta", 9.0);
        Product product10 = new Product("Steak", 10.0);

        Table table1 = new Table(List.of(product1, product2, product3));
        Table table2 = new Table(List.of(product4, product5, product6));
        Table table3 = new Table(List.of(product7, product8, product9, product10));

        Income income = new Income(List.of(table1, table2, table3));
        System.out.println("Total income: " + income.calculateIncome());
    }

}
