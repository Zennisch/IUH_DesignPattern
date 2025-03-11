package observer;

public class Student implements Observer {

    private final String name;

    public Student(String name) {
        this.name = name;
    }

    @Override
    public void update() {
        System.out.println("Student " + name + " received notification");
    }
}
