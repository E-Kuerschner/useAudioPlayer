/** @type {import("@yarnpkg/types")} */
const { defineConfig } = require("@yarnpkg/types")

/**
 * This rule will enforce that a workspace MUST depend on the same version of a dependency as the one used by the other workspaces
 *
 * @param {import("@yarnpkg/types").Yarn.Constraints.Context} context
 *  */
const enforceConsistentDependenciesAcrossTheProject = ({ Yarn }) => {
    for (const dep of Yarn.dependencies()) {
        if (dep.type === "peerDependencies") continue
        for (const otherDep of Yarn.dependencies({ ident: dep.ident })) {
            if (otherDep.type === "peerDependencies") continue
            dep.update(otherDep.range)
        }
    }
}

/**
 * This rule will enfore that the :^workspace protocol will be used when referencing packages in this project
 *
 * @param {import("@yarnpkg/types").Yarn.Constraints.Context} context
 * */
const enforceWorkspaceDependenciesWhereAvailable = ({ Yarn }) => {
    for (const workspace of Yarn.workspaces()) {
        for (const workspacePackageDep of Yarn.dependencies({
            ident: workspace.ident
        })) {
            if (workspacePackageDep.type === "peerDependencies") continue
            workspacePackageDep.update("workspace:^")
        }
    }
}

module.exports = defineConfig({
    async constraints(context) {
        enforceConsistentDependenciesAcrossTheProject(context)
        enforceWorkspaceDependenciesWhereAvailable(context)
    }
})
