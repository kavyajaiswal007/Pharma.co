package co.pharma.dto;

import co.pharma.model.Medicine;

import java.util.List;
import java.util.Map;

public class DashboardStats {
    private long totalMedicines;
    private long activeCustomers;
    private long totalSuppliers;
    private double todayIncome;
    private double totalRevenue;
    private long totalOrders;
    private List<Map<String, Object>> salesTrends;
    private List<Medicine> expiringSoon;
    private List<Medicine> lowStock;
    private String funFactOfDay;

    public DashboardStats() {}

    public long getTotalMedicines() { return totalMedicines; }
    public void setTotalMedicines(long totalMedicines) { this.totalMedicines = totalMedicines; }

    public long getActiveCustomers() { return activeCustomers; }
    public void setActiveCustomers(long activeCustomers) { this.activeCustomers = activeCustomers; }

    public long getTotalSuppliers() { return totalSuppliers; }
    public void setTotalSuppliers(long totalSuppliers) { this.totalSuppliers = totalSuppliers; }

    public double getTodayIncome() { return todayIncome; }
    public void setTodayIncome(double todayIncome) { this.todayIncome = todayIncome; }

    public double getTotalRevenue() { return totalRevenue; }
    public void setTotalRevenue(double totalRevenue) { this.totalRevenue = totalRevenue; }

    public long getTotalOrders() { return totalOrders; }
    public void setTotalOrders(long totalOrders) { this.totalOrders = totalOrders; }

    public List<Map<String, Object>> getSalesTrends() { return salesTrends; }
    public void setSalesTrends(List<Map<String, Object>> salesTrends) { this.salesTrends = salesTrends; }

    public List<Medicine> getExpiringSoon() { return expiringSoon; }
    public void setExpiringSoon(List<Medicine> expiringSoon) { this.expiringSoon = expiringSoon; }

    public List<Medicine> getLowStock() { return lowStock; }
    public void setLowStock(List<Medicine> lowStock) { this.lowStock = lowStock; }

    public String getFunFactOfDay() { return funFactOfDay; }
    public void setFunFactOfDay(String funFactOfDay) { this.funFactOfDay = funFactOfDay; }
}
