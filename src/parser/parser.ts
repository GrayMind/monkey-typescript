import { Lexer } from '../lexer/lexer'
import { Token, TokenType, tt } from '../token/token'
import {
  Statement,
  Program,
  LetStatement,
  Identifier,
  ReturnStatement
} from '../ast/ast'

export class Parser {
  l: Lexer
  errors: string[]

  curToken: Token
  peekToken: Token

  statements: Statement[]

  constructor (l: Lexer) {
    this.l = l
    this.errors = []

    this.nextToken()
    this.nextToken()
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
        return null
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
