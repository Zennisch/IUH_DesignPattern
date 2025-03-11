package observer;

public class Main {

    public static void main(String[] args) {
        Classroom classroom = new Classroom();
        Student student1 = new Student("John");
        Student student2 = new Student("Jane");
        Student student3 = new Student("Doe");

        classroom.attach(student1);
        classroom.attach(student2);
        classroom.attach(student3);

        classroom.notification();
    }

}
