class PathFinder {

    /*
        Recursively search line of site starting at the source CenterPoint ('from'), going to the destination ('to')

        1. First, determine which immediate neighboring hexes must be considered for line of site.
            a. Calculate which 60deg sector the destination vector falls into (from the perspective of the source)
                i. If it lies exactly on the boarder between 2 sectors (center points align on vector), then both hexes need to be considered (line of site is only blocked if both hexes block)
        2. Check whether immediate neighbors-in-path block
            a. if not blocked by immediate neighbors, continue on in the search (outwards along the vector)
    */
    hasLineOfSite(from, to) {

    }

    getTargetsInRange(from) {

    }
}

export default PathFinder;