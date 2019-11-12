class IdGenerator {

    constructor () {
        this.latestCenterPointId = 0;
        this.latestIntersectionId = 0;
    }

    nextCenterPointId() {
        return this.latestCenterPointId++;
    }

    nextIntersectionId() {
        return this.latestIntersectionId++;
    }
}

export default IdGenerator