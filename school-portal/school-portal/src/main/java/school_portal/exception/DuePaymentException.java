package school_portal.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.BAD_REQUEST)
public class DuePaymentException extends RuntimeException {
    public DuePaymentException(String message) {
        super(message);
    }
}
