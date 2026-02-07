package ma.eventma.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.Map;

@Service
public class JwtService {

  private final SecretKey key;
  private final long expirationMillis;

  public JwtService(@Value("${app.jwt.secret}") String secret,
                    @Value("${app.jwt.expirationMinutes}") long expirationMinutes) {
    this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    this.expirationMillis = expirationMinutes * 60L * 1000L;
  }

  public String generateToken(String subject, Map<String, Object> claims) {
    Date now = new Date();
    Date exp = new Date(now.getTime() + expirationMillis);
    return Jwts.builder()
        .setSubject(subject)
        .addClaims(claims)
        .setIssuedAt(now)
        .setExpiration(exp)
        .signWith(key)
        .compact();
  }

  public String extractSubject(String token) {
    return parseAllClaims(token).getSubject();
  }

  public Claims parseAllClaims(String token) {
    return Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(token).getBody();
  }
}
