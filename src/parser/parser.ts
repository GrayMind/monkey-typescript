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
  IntegerLiteral
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
      return null
    }
    const leftExp = prefix.call(this)
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
