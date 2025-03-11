package observer;

import java.util.ArrayList;
import java.util.List;

public class Classroom implements Subject {

    private List<Observer> list;

    public Classroom() {
        this.list = new ArrayList<>();
    }

    @Override
    public void attach(Observer observer) {
        list.add(observer);
    }

    @Override
    public void detach(Observer observer) {
        list.remove(observer);
    }

    @Override
    public void notification() {
        for (Observer observer : list) {
            observer.update();
        }
    }
}
