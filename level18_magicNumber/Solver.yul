object "Solver" {
    code {
        datacopy(0, dataoffset("runtime"), datasize("runtime"))
        return(0, datasize("runtime"))
    }

    object "runtime" {
        code {
            mstore(0x0, 0x2a)
            return(0x0, 0x20)
        }
    }
}