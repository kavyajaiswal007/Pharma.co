package co.pharma.service;

import co.pharma.model.Customer;
import co.pharma.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public List<Customer> getAllCustomers(String search) {
        if (search != null && !search.trim().isEmpty()) {
            return customerRepository.searchCustomers(search.trim());
        }
        return customerRepository.findAllByOrderByIdDesc();
    }

    public Optional<Customer> getCustomerById(Long id) {
        return customerRepository.findById(id);
    }

    public Customer saveCustomer(Customer customer) {
        if (customer.getLoyaltyTier() == null || customer.getLoyaltyTier().isEmpty()) {
            customer.setLoyaltyTier("Bronze");
        }
        return customerRepository.save(customer);
    }

    public Customer updateCustomer(Long id, Customer updated) {
        return customerRepository.findById(id).map(c -> {
            c.setName(updated.getName());
            c.setContact(updated.getContact());
            c.setAddress(updated.getAddress());
            if (updated.getLoyaltyTier() != null) {
                c.setLoyaltyTier(updated.getLoyaltyTier());
            }
            return customerRepository.save(c);
        }).orElseThrow(() -> new RuntimeException("Customer not found: " + id));
    }

    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }
}
