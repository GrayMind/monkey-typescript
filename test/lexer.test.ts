import { Lexer } from "../src/lexer/lexer";
import { Token, tt } from "../src/token/token";

test("lexer", () => {
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
    next = l.nextToken();
    index++;
  }
  expect(next.type).toBe(expectedTokens[index].type);
});
