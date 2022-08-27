import { Lexer } from '../lexer/lexer'
import { Token, TokenType, tt } from '../token/token'
import {
  Statement,
  Program,
  LetStatement,
  Identifier,
  ReturnStatement,
  Expression,
  ExpressionStatement,
  IntegerLiteral,
  PrefixExpression,
  InfixExpression
} from '../ast/ast'

// 优先级
export enum Precedence {
  LOWEST = 1,
  EQUALS, // ==
  LESSGREATER, // > or <
  SUM, // +
  PRODUCT, // *
  PREFIX, // -x or !x
  CALL // myFunction(x)
}

// 运算符优先级
export const TokenPrecedence = {
  [tt.EQ]: Precedence.EQUALS,
  [tt.NOT_EQ]: Precedence.EQUALS,
  [tt.LT]: Precedence.LESSGREATER,
  [tt.GT]: Precedence.LESSGREATER,
  [tt.PLUS]: Precedence.SUM,
  [tt.MINUS]: Precedence.SUM,
  [tt.SLASH]: Precedence.PRODUCT,
  [tt.ASTERISK]: Precedence.PRODUCT
}

export type prefixParseFn = () => Expression
export interface PrefixParseFns {
  [name: string]: prefixParseFn
}

export type infixParseFn = (node: Expression) => Expression
export interface InfixParseFns {
  [name: string]: infixParseFn
}

export class Parser {
  l: Lexer
  errors: string[]

  curToken: Token
  peekToken: Token

  prefixParseFns: PrefixParseFns
  infixParseFns: InfixParseFns

  constructor (l: Lexer) {
    this.l = l
    this.errors = []

    this.nextToken()
    this.nextToken()

    this.registerPrefix(tt.IDENT, this.parseIdentifier)
    this.registerPrefix(tt.INT, this.parseIntegerLiteral)
    this.registerPrefix(tt.BANG, this.parsePrefixExpression)
    this.registerPrefix(tt.MINUS, this.parsePrefixExpression)

    this.registerInfix(tt.EQ, this.parseInfixExpression)
    this.registerInfix(tt.NOT_EQ, this.parseInfixExpression)
    this.registerInfix(tt.LT, this.parseInfixExpression)
    this.registerInfix(tt.GT, this.parseInfixExpression)
    this.registerInfix(tt.PLUS, this.parseInfixExpression)
    this.registerInfix(tt.MINUS, this.parseInfixExpression)
    this.registerInfix(tt.SLASH, this.parseInfixExpression)
    this.registerInfix(tt.ASTERISK, this.parseInfixExpression)
  }

  nextToken (): void {
    this.curToken = this.peekToken
    this.peekToken = this.l.nextToken()
  }

  peekError (t: TokenType): void {
    const msg = `expected next token to be ${t}, got ${this.peekToken.type} instead`
    this.errors.push(msg)
  }

  parseProgram (): Program {
    const program = new Program()
    program.statements = []
    while (this.curToken.type !== tt.EOF) {
      const stmt = this.parseStatement()
      if (stmt !== null) {
        program.statements.push(stmt)
      }
      this.nextToken()
    }
    return program
  }

  parseStatement (): Statement | null {
    switch (this.curToken.type) {
      case tt.LET:
        return this.parseLetStatement()
      case tt.RETURN:
        return this.parseReturnStatement()
      default:
        return this.parseExpressionStatement()
    }
  }

  parseLetStatement (): LetStatement | null {
    const stmt = new LetStatement()
    stmt.token = this.curToken
    if (!this.expectPeek(tt.IDENT)) {
      return null
    }
    stmt.name = new Identifier(this.curToken, this.curToken.literal)

    if (!this.expectPeek(tt.ASSIGN)) {
      return null
    }

    while (!this.curTokenIs(tt.SEMICOLON)) {
      this.nextToken()
    }
    return stmt
  }

  parseReturnStatement (): ReturnStatement {
    const stmt = new ReturnStatement()
    stmt.token = this.curToken

    this.nextToken()

    while (!this.curTokenIs(tt.SEMICOLON)) {
      this.nextToken()
    }
    return stmt
  }

  parseExpressionStatement (): ExpressionStatement {
    const stmt = new ExpressionStatement()
    stmt.token = this.curToken
    stmt.expression = this.parseExpression(Precedence.LOWEST)

    if (this.peekTokenIs(tt.SEMICOLON)) {
      this.nextToken()
    }

    return stmt
  }

  parseExpression (precedence: Precedence): any {
    const prefix = this.prefixParseFns[this.curToken.type]
    if (!prefix) {
      this.errors.push(`no prefix parse function for ${this.curToken.type} found`)
      return null
    }
    let leftExp = prefix.call(this)

    while (!this.peekTokenIs(tt.SEMICOLON) && precedence < this.peekPrecedence()) {
      const infix = this.infixParseFns[this.peekToken.type]
      if (!infix) {
        return leftExp
      }

      this.nextToken()

      leftExp = infix.call(this, leftExp)
    }
    return leftExp
  }

  parseIdentifier (): Expression {
    const token = this.curToken
    return new Identifier(
      token,
      token.literal
    )
  }

  parseIntegerLiteral (): Expression {
    const token = this.curToken
    return new IntegerLiteral(
      token,
      parseInt(this.curToken.literal)
    )
  }

  parsePrefixExpression (): Expression {
    const exp = new PrefixExpression()
    exp.token = this.curToken
    exp.operator = this.curToken.literal

    this.nextToken()

    exp.right = this.parseExpression(Precedence.PREFIX)

    return exp
  }

  parseInfixExpression (left: Expression): Expression {
    const exp = new InfixExpression()
    exp.token = this.curToken
    exp.operator = this.curToken.literal
    exp.left = left

    const precedence = this.curPrecedence()
    this.nextToken()
    exp.right = this.parseExpression(precedence)
    return exp
  }

  curTokenIs (t: TokenType): boolean {
    return this.curToken.type === t
  }

  peekTokenIs (t: TokenType): boolean {
    return this.peekToken.type === t
  }

  expectPeek (t: TokenType): boolean {
    if (this.peekTokenIs(t)) {
      this.nextToken()
      return true
    } else {
      this.peekError(t)
      return false
    }
  }

  curPrecedence (): Precedence {
    if (this.peekToken && TokenPrecedence[this.curToken.type]) {
      return TokenPrecedence[this.curToken.type]
    }
    return Precedence.LOWEST
  }

  peekPrecedence (): Precedence {
    if (this.peekToken && TokenPrecedence[this.peekToken.type]) {
      return TokenPrecedence[this.peekToken.type]
    }
    return Precedence.LOWEST
  }

  registerPrefix (t: TokenType, fn: prefixParseFn): void {
    if (!this.prefixParseFns) {
      this.prefixParseFns = {}
    }
    this.prefixParseFns[t] = fn
  }

  registerInfix (t: TokenType, fn: infixParseFn): void {
    if (!this.infixParseFns) {
      this.infixParseFns = {}
    }
    this.infixParseFns[t] = fn
  }
}

/**
function parseProgram() {
  program = newProgramASTNode()
  advanceTokens()
  for (currentToken() != EOF_TOKEN) {
    statement = null
    if (currentToken() == LET_TOKEN) {
      statement = parseLetStatement()
    } else if (currentToken() == RETURN_TOKEN) {
      statement = parseReturnStatement()
    } else if (currentToken() == IF_TOKEN) {
      statement = parseIfStatement()
    }
    if (statement != null) {
      program.Statements.push(statement)
    }
    advanceTokens()
  }
  return program
}

function parseLetStatement() {
  advanceTokens()
  identifier = parseIdentifier()
  advanceTokens()
  if currentToken() != EQUAL_TOKEN {
    parseError("no equal sign!")
    return null
  }
  advanceTokens()
  value = parseExpression()
  variableStatement = newVariableStatementASTNode()
  variableStatement.identifier = identifier
  variableStatement.value = value
  return variableStatement
}

function parseIdentifier() {
  identifier = newIdentifierASTNode()
  identifier.token = currentToken()
  return identifier
}

function parseExpression() {
  if (currentToken() == INTEGER_TOKEN) {
    if (nextToken() == PLUS_TOKEN) {
      return parseOperatorExpression()
    } else if (nextToken() == SEMICOLON_TOKEN) {
      return parseIntegerLiteral()
    }
  } else if (currentToken() == LEFT_PAREN) {
    return parseGroupedExpression()
  }
  // [...]
}

function parseOperatorExpression() {
  operatorExpression = newOperatorExpression()
  operatorExpression.left = parseIntegerLiteral()
  operatorExpression.operator = currentToken()
  operatorExpression.right = parseExpression()
  return operatorExpression()
}
// [...]

 */
