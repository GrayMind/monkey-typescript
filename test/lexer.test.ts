import { Lexer } from "../src/lexer/lexer";
import { Token, tt } from "../src/token/token";

test("lexer-base", () => {
  const input = "+=(){},;";
  const expectedTokens: Token[] = [
    new Token(tt.PLUS, "+"),
    new Token(tt.ASSIGN, "="),
    new Token(tt.LPAREN, "("),
    new Token(tt.RPAREN, ")"),
    new Token(tt.LBRACE, "{"),
    new Token(tt.RBRACE, "}"),
    new Token(tt.COMMA, ","),
    new Token(tt.SEMICOLON, ";"),
    new Token(tt.EOF, ""),
  ];
  const l: Lexer = new Lexer(input);
  let next: Token = l.nextToken();

  let index = 0;
  while (next.type !== tt.EOF) {
    expect(next.type).toBe(expectedTokens[index].type);
    expect(next.literal).toBe(expectedTokens[index].literal);
    next = l.nextToken();
    index++;
  }
  expect(next.type).toBe(expectedTokens[index].type);
});

test("lexer", () => {
  const input = `let five = 5;
    let ten = 10;
    let add = fn(x, y) {
      x + y;
    };
    let result = add(five, ten);

    !-/*5;
    5 < 10 > 5;

    if (5 < 10) {
      return true;
    } else {
      return false;
    }
    10 == 10;
    10 != 9;
  `;
  const expectedTokens: Token[] = [
    new Token(tt.LET, "let"),
    new Token(tt.IDENT, "five"),
    new Token(tt.ASSIGN, "="),
    new Token(tt.INT, "5"),
    new Token(tt.SEMICOLON, ";"),
    new Token(tt.LET, "let"),
    new Token(tt.IDENT, "ten"),
    new Token(tt.ASSIGN, "="),
    new Token(tt.INT, "10"),
    new Token(tt.SEMICOLON, ";"),
    new Token(tt.LET, "let"),
    new Token(tt.IDENT, "add"),
    new Token(tt.ASSIGN, "="),
    new Token(tt.FUNCTION, "fn"),
    new Token(tt.LPAREN, "("),
    new Token(tt.IDENT, "x"),
    new Token(tt.COMMA, ","),
    new Token(tt.IDENT, "y"),
    new Token(tt.RPAREN, ")"),
    new Token(tt.LBRACE, "{"),
    new Token(tt.IDENT, "x"),
    new Token(tt.PLUS, "+"),
    new Token(tt.IDENT, "y"),
    new Token(tt.SEMICOLON, ";"),
    new Token(tt.RBRACE, "}"),
    new Token(tt.SEMICOLON, ";"),

    new Token(tt.LET, "let"),
    new Token(tt.IDENT, "result"),
    new Token(tt.ASSIGN, "="),
    new Token(tt.IDENT, "add"),
    new Token(tt.LPAREN, "("),
    new Token(tt.IDENT, "five"),
    new Token(tt.COMMA, ","),
    new Token(tt.IDENT, "ten"),
    new Token(tt.RPAREN, ")"),
    new Token(tt.SEMICOLON, ";"),

    new Token(tt.BANG, "!"),
    new Token(tt.MINUS, "-"),
    new Token(tt.SLASH, "/"),
    new Token(tt.ASTERISK, "*"),
    new Token(tt.INT, "5"),
    new Token(tt.SEMICOLON, ";"),

    new Token(tt.INT, "5"),
    new Token(tt.LT, "<"),
    new Token(tt.INT, "10"),
    new Token(tt.GT, ">"),
    new Token(tt.INT, "5"),
    new Token(tt.SEMICOLON, ";"),

    new Token(tt.IF, "if"),
    new Token(tt.LPAREN, "("),
    new Token(tt.INT, "5"),
    new Token(tt.LT, "<"),
    new Token(tt.INT, "10"),
    new Token(tt.RPAREN, ")"),
    new Token(tt.LBRACE, "{"),
    new Token(tt.RETURN, "return"),
    new Token(tt.TRUE, "true"),
    new Token(tt.SEMICOLON, ";"),
    new Token(tt.RBRACE, "}"),
    new Token(tt.ELSE, "else"),
    new Token(tt.LBRACE, "{"),
    new Token(tt.RETURN, "return"),
    new Token(tt.FALSE, "false"),
    new Token(tt.SEMICOLON, ";"),
    new Token(tt.RBRACE, "}"),

    new Token(tt.INT, "10"),
    new Token(tt.EQ, "=="),
    new Token(tt.INT, "10"),
    new Token(tt.SEMICOLON, ";"),
    new Token(tt.INT, "10"),
    new Token(tt.NOT_EQ, "!="),
    new Token(tt.INT, "9"),
    new Token(tt.SEMICOLON, ";"),

    new Token(tt.EOF, ""),
  ];
  const l: Lexer = new Lexer(input);
  let next: Token = l.nextToken();

  let index = 0;
  while (next.type !== tt.EOF) {
    expect(next.type).toBe(expectedTokens[index].type);
    expect(next.literal).toBe(expectedTokens[index].literal);
    next = l.nextToken();
    index++;
  }
  expect(next.type).toBe(expectedTokens[index].type);
});
