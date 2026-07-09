import XCTest
import SwiftUI
@testable import CodebergClient

final class ModelDecodingTests: XCTestCase {
    func testDecodesTimestampWithoutFractionalSeconds() throws {
        let json = #"{"id":1,"body":"hi","user":null,"created_at":"2023-05-01T12:00:00Z","updated_at":"2023-05-01T12:00:00Z"}"#
        let comment = try JSONCoding.decoder.decode(Comment.self, from: Data(json.utf8))
        XCTAssertEqual(comment.id, 1)
        XCTAssertNotNil(comment.createdAt)
    }

    func testDecodesTimestampWithFractionalSeconds() throws {
        let json = #"{"id":2,"body":"yo","user":null,"created_at":"2023-05-01T12:00:00.123Z"}"#
        let comment = try JSONCoding.decoder.decode(Comment.self, from: Data(json.utf8))
        XCTAssertNotNil(comment.createdAt)
    }

    func testIssueDetectsPullRequest() throws {
        let json = """
        {"id":10,"number":5,"title":"Fix","state":"open","labels":[],"comments":0,
         "pull_request":{"merged":false}}
        """
        let issue = try JSONCoding.decoder.decode(Issue.self, from: Data(json.utf8))
        XCTAssertTrue(issue.isPullRequest)
        XCTAssertEqual(issue.number, 5)
    }

    func testPlainIssueIsNotPullRequest() throws {
        let json = #"{"id":11,"number":6,"title":"Bug","state":"open","labels":[],"comments":3}"#
        let issue = try JSONCoding.decoder.decode(Issue.self, from: Data(json.utf8))
        XCTAssertFalse(issue.isPullRequest)
        XCTAssertEqual(issue.commentsCount, 3)
    }

    func testDecodesLabelColor() throws {
        let json = #"{"id":1,"name":"bug","color":"d73a4a","description":"Broken"}"#
        let label = try JSONCoding.decoder.decode(Label.self, from: Data(json.utf8))
        XCTAssertEqual(label.name, "bug")
        XCTAssertNotNil(Color(hex: label.color))
    }
}
